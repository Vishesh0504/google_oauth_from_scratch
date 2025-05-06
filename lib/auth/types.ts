export interface OIDCConfiguration {
  authorization_endpoint: string;
  token_endpoint: string;
  userinfo_endpoint: string;
  jwks_uri: string;
  issuer: string;
}

export interface IDToken {
  iss: string;
  sub: string; //user id in db
  aud: string; //google client id of the application
  exp: number; // expiration time
  iat: number; //issued time
  auth_time: number; //Time of authentication
  nonce: string;
  email?: string;
  name?: string;
}

export interface User {
  id: string;
  google_id: string;
  email: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  picture?: string;
  created_at: string;
  updated_at: string;
  slug?: string;
}
