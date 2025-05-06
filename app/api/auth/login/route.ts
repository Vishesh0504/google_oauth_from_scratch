import { OIDCClient } from "@/lib/auth/oidc";
import { NextResponse } from "next/server";

export async function GET() {
  const oidcClient = new OIDCClient();
  await oidcClient.initialize();
  const { url, sessionData } = await oidcClient.createAuthRequest();
  const response = NextResponse.redirect(url);
  response.cookies.set("session_data", JSON.stringify(sessionData), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 5 * 60,
    secure: process.env.NODE_ENV == "production",
  });
  return response;
}
