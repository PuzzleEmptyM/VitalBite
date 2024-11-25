import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Fetch the token from the request using the secret
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Define the URL paths that do not require authentication
  const publicPaths = ["/login", "/signup"];

  const { pathname } = req.nextUrl;

  // Allow access if the user is visiting a public path or has a valid token
  if (publicPaths.includes(pathname) || token) {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|logo.png|images/|signup).*)"],
};
