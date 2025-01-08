import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { validateSession } from "./lib/auth"

export async function middleware(request: NextRequest) {
	// Only signin is a public path
	const publicPaths = ["/signin"]

	const isPublicPath = publicPaths.some((path) =>
		request.nextUrl.pathname.startsWith(path)
	)

	const isAuthenticated = validateSession(request)

	// If the user is not authenticated and trying to access a protected route
	if (!isAuthenticated && !isPublicPath) {
		return NextResponse.redirect(new URL("/signin", request.url))
	}

	// If the user is authenticated and trying to access signin
	if (isAuthenticated && isPublicPath) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
