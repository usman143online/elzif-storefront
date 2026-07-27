import { NextRequest, NextResponse } from "next/server"

/**
 * This store operates with a single region (Pakistan), so there is no
 * need to redirect based on a country code in the URL. We only make
 * sure a cache id cookie exists for downstream data fetching.
 */
export async function middleware(request: NextRequest) {
  const cacheIdCookie = request.cookies.get("_medusa_cache_id")

  if (cacheIdCookie) {
    return NextResponse.next()
  }

  const cacheId = crypto.randomUUID()
  const response = NextResponse.next()
  response.cookies.set("_medusa_cache_id", cacheId, {
    maxAge: 60 * 60 * 24,
  })

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
