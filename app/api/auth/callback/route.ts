import { OIDCClient } from "@/lib/auth/oidc";
import { NextRequest, NextResponse } from "next/server";
import { createAnonClient } from "@/lib/supabase/server";
import { makeJWTToken } from "@/lib/utils";
import { User } from "@/lib/auth/types";
import { QueryError } from "@supabase/supabase-js";
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const receivedState = url.searchParams.get("state");

    // Check for missing query params
    if (!code || !receivedState) {
      return NextResponse.redirect(
        new URL("/error?reason=missing_auth_parameters", request.nextUrl.origin)
      );
    }

    // Check for missing session cookie
    const sessionCookie = request.cookies.get("session_data")?.value;
    if (!sessionCookie) {
      return NextResponse.redirect(
        new URL("/error?reason=no_session_cookie", request.nextUrl.origin)
      );
    }
    // Parse session data safely
    let sessionData;
    try {
      sessionData = await JSON.parse(sessionCookie);
    } catch {
      return NextResponse.redirect(
        new URL("/error?reason=invalid_session_data", request.nextUrl.origin)
      );
    }

    const { nonce, code_verifier, state } = sessionData;
    if (!nonce || !code_verifier || !state) {
      return NextResponse.redirect(
        new URL("/error?reason=incomplete_session_data", request.nextUrl.origin)
      );
    }

    if (receivedState !== state) {
      return NextResponse.redirect(
        new URL("/error?reason=state_mismatch", request.nextUrl.origin)
      );
    }

    const oidcClient = new OIDCClient();
    await oidcClient.initialize();

    const tokens = await oidcClient.validateCallback(
      code,
      sessionData,
      receivedState
    );
    const supabase = createAnonClient();
    const { sub, email, name, given_name, family_name, picture } =
      tokens.idToken;
    const { data: user, error: upsertError } = (await supabase
      .from("users")
      .upsert(
        {
          google_id: sub,
          email,
          name,
          given_name,
          family_name,
          picture,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "google_id",
        }
      )
      .select()
      .single()) as { data: User | null; error: QueryError };

    if (upsertError) {
      console.error("Upsert error:", upsertError.message);
      throw new Error(`Failed to upsert user:${upsertError.message}`);
    }
    if (user) {
      const redirectTo = user.slug ? "/[slug]/dashboard" : "/onboarding";
      const response = NextResponse.redirect(
        new URL(redirectTo, request.nextUrl.origin)
      );
      response.cookies.delete("session_data");
      const jwtToken = await makeJWTToken({
        user_id: user.id,
        sub: user.google_id,
      });
      response.cookies.set("session_token", jwtToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 3599,
        secure: process.env.NODE_ENV == "production",
      });
      return response;
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Callback error:", errorMessage);
    return NextResponse.redirect(
      new URL(
        `/error?reason=authentication_failed&details=${encodeURIComponent(
          errorMessage
        )}`,
        request.nextUrl.origin
      )
    );
  }
}
