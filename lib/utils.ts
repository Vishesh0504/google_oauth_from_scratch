import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as jose from "jose";
import { JWTPayload } from "jose";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function makeJWTToken(token: JWTPayload) {
  const secret = process.env.JWT_SECRET!;
  const alg = "HS256";
  const jwtSecret = new TextEncoder().encode(secret);
  const jwt = await new jose.SignJWT(token)
    .setProtectedHeader({ alg })
    .setAudience("my-blog-api")
    .setIssuedAt()
    .setIssuer("blogspace")
    .setExpirationTime("1h")
    .sign(jwtSecret);
  return jwt;
}
