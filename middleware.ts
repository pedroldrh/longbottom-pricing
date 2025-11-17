import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const session = request.cookies.get("session")
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/calculator") ||
    request.nextUrl.pathname.startsWith("/print") ||
    request.nextUrl.pathname.startsWith("/parity")

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
