// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Rep trying to hit owner dashboard → kick to /rep
    if (pathname.startsWith("/dashboard") && !pathname.startsWith("/dashboard/rep") && token?.isMember) {
      return NextResponse.redirect(new URL("/dashboard/rep", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: { signIn: "/login" },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/onboarding/:path*", "/rep/:path*"],
};