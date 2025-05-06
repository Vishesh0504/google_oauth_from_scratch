import { generateCodeChallenge, generateCodeVerifier } from "./pkce";
import { OIDCConfiguration } from "./types";
import { randomBytes } from "crypto";
import { JSONWebKeySet, createLocalJWKSet, jwtVerify } from "jose";
export class OIDCClient {
  private config: OIDCConfiguration;
  private jwks: JSONWebKeySet;

  constructor() {
    this.config = {} as OIDCConfiguration;
    this.jwks = {} as JSONWebKeySet;
  }

  async initialize() {
    const configDiscovery = await fetch(
      "https://accounts.google.com/.well-known/openid-configuration"
    );
    this.config = await configDiscovery.json();
    const jwksRes = await fetch(this.config.jwks_uri);
    this.jwks = await jwksRes.json();
  }

  async createAuthRequest(): Promise<{
    url: string;
    sessionData: Record<string, string>;
  }> {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    const nonce = randomBytes(32).toString("hex");
    const state = randomBytes(32).toString("hex");

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      scope: ["openid", "profile", "email"].join(" "),

      code_challenge: codeChallenge,
      code_challenge_method: "S256",
      nonce: nonce,
      state: state,
      response_mode: "query",
      prompt: "consent",
    });
    return {
      url: `${this.config.authorization_endpoint}?${params.toString()}`,
      sessionData: {
        code_verifier: codeVerifier,
        state: state,
        nonce,
      },
    };
  }

  async validateCallback(
    code: string,
    sessionData: Record<string, string>,
    receivedState: string
  ) {
    if (receivedState != sessionData.state) {
      throw new Error("Invalid state parameter");
    }

    const tokenResponse = await fetch(this.config.token_endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        code_verifier: sessionData.code_verifier,
        client_id: process.env.GOOGLE_CLIENT_ID!,
      }),
    });
    const tokens = await tokenResponse.json();
    const idToken = await this.verifyIDToken(
      tokens.id_token,
      sessionData.nonce
    );

    return {
      idToken,
    };
  }

  async verifyIDToken(idToken: string, storedNonce: string) {
    try {
      const JWKS = createLocalJWKSet(this.jwks);
      const { payload } = await jwtVerify(idToken, JWKS, {
        issuer: this.config.issuer,
        audience: process.env.GOOGLE_CLIENT_ID!,
      });

      if (payload.nonce != storedNonce) {
        throw new Error("Invalid nonce in ID Token");
      }
      return payload;
    } catch (error) {
      throw new Error(`ID token validation failed: ${error}`);
    }
  }
}
