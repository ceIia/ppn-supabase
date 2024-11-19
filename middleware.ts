import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname === "/" && request.method === "POST") {
    // clone the request headers
    const headers = new Headers(request.headers);

    // create a new URL for the forwarded request
    const forwardUrl = new URL("/s", request.url);

    // forward the request to the /s route
    return NextResponse.rewrite(forwardUrl, {
      request: {
        headers: headers,
      },
    });
  }

  // for all other requests, continue as normal
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
