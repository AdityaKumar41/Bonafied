import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Assuming you're using a cookie to store the authentication token
  const token = req.cookies.get("token");

  // If there's no token, redirect to the login page
  if (!token) {
    // Create a URL object for the login page
    const loginUrl = new URL("/login", req.url);

    // Redirect the user to the login page
    return NextResponse.redirect(loginUrl);
  }

  // If the user is authenticated, allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile", "/credentaial/:path*"],
};
