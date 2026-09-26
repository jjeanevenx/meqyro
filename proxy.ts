import { NextRequest, NextResponse } from "next/server";
import { isLocale } from "./src/lib/i18n/config";
import { createRequestId } from "./src/lib/observability/request-id";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/") {
    const preferred = request.cookies.get("meqyro_locale")?.value;
    if (preferred && isLocale(preferred))
      return NextResponse.redirect(new URL(`/${preferred}`, request.url));
  }

  const headers = new Headers(request.headers);
  headers.set("x-request-id", request.headers.get("x-request-id") ?? createRequestId());
  const response = NextResponse.next({ request: { headers } });
  response.headers.set("x-request-id", headers.get("x-request-id")!);
  return response;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"] };
