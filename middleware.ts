import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow the request if the token is present and the user is not new
  if (token) {
    if (token.isNewUser && pathname !== "/signupgoogle") {
      return NextResponse.redirect(`${origin}/signupgoogle`);
    }
    return NextResponse.next();
  }

  // Redirect unauthenticated users trying to access protected routes
  if (
    !token &&
    pathname !== "/login" &&
    pathname !== "/signupgoogle" &&
    !pathname.startsWith("/api/auth")
  ) {
    return NextResponse.redirect(`${origin}/login`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|images/|signup).*)"],
};
