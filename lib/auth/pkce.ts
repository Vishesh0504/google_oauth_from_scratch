import { createHash, randomBytes } from "crypto";

export function generateCodeVerifier(): string {
  const verifier = randomBytes(64).toString("base64url").slice(0, 128);
  return verifier;
}

export function generateCodeChallenge(verifier: string) {
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  return challenge;
}
