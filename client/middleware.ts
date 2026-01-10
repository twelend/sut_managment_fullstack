import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const session = cookies.get("auth-token")?.value;

  const isAuthPage = nextUrl.pathname.startsWith("/teacher/login");

  if (isAuthPage) {
    if (session) {
      return NextResponse.redirect(new URL("/teacher/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/teacher/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/teacher/dashboard", "/teacher/dashboard/:path*"],
};


