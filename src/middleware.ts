import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// List of public paths that don't require authentication
const publicPaths = ["/sign-in"]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const isPublicPath = publicPaths.includes(pathname)

	// Get the authentication cookie
	const authCookie = request.cookies.get("auth_session")

	// If the path is public and user is authenticated, redirect to home
	if (isPublicPath && authCookie) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	// If the path is protected and user is not authenticated, redirect to sign-in
	if (!isPublicPath && !authCookie) {
		const signInUrl = new URL("/sign-in", request.url)
		return NextResponse.redirect(signInUrl)
	}

	return NextResponse.next()
}

// Configure which paths the middleware should run on
export const config = {
	matcher: [
		/*
		 * Match all request paths except:
		 * - api routes
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 * - public files (public folder)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|public).*)",
	],
}