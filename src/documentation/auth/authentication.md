# Authentication System Documentation

## Overview

This application implements a simple, secure authentication system using HTTP-only cookies and environment-based admin credentials.

## Implementation

### Core Files

1. **Middleware**
   **File:** `src/middleware.ts`

```typescript
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const publicPaths = ["/sign-in"]

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
	const isPublicPath = publicPaths.includes(pathname)
	const authCookie = request.cookies.get("auth_session")

	// Redirect authenticated users away from public paths
	if (isPublicPath && authCookie) {
		return NextResponse.redirect(new URL("/", request.url))
	}

	// Redirect unauthenticated users to sign-in
	if (!isPublicPath && !authCookie) {
		const signInUrl = new URL("/sign-in", request.url)
		return NextResponse.redirect(signInUrl)
	}

	return NextResponse.next()
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
}
```

2. **Sign In API**
   **File:** `src/app/api/auth/signin/route.ts`

```typescript
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json()

		// Validate against environment variables
		if (
			email !== process.env.ADMIN_EMAIL ||
			password !== process.env.ADMIN_PASSWORD
		) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			)
		}

		// Create authenticated session
		const response = NextResponse.json({ success: true })
		response.cookies.set("auth_session", "authenticated", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			maxAge: 60 * 60 * 24, // 24 hours
		})

		return response
	} catch (error) {
		console.error("Sign-in error:", error)
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		)
	}
}
```

3. **Sign Out API**
   **File:** `src/app/api/auth/signout/route.ts`

```typescript
import { NextResponse } from "next/server"

export async function POST() {
	const response = NextResponse.json({ success: true })

	// Remove auth cookie
	response.cookies.set("auth_session", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0, // Expire immediately
	})

	return response
}
```

## Configuration

### Environment Variables

```env
ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_secure_password
```

### Security Features

1. **HTTP-Only Cookies**

    - Prevents client-side access to session cookie
    - Mitigates XSS attacks

2. **Secure Cookie Settings**

    ```typescript
    {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24, // 24 hours
    }
    ```

3. **Protected Routes**
    - All non-public routes require authentication
    - Automatic redirects to sign-in page

## Usage

### Sign In Flow

```typescript
async function handleSignIn(email: string, password: string) {
	const response = await fetch("/api/auth/signin", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ email, password }),
	})

	if (!response.ok) {
		const error = await response.json()
		throw new Error(error.message || "Failed to sign in")
	}

	// Redirect to home page on success
	window.location.href = "/"
}
```

### Sign Out Flow

```typescript
async function handleSignOut() {
	await fetch("/api/auth/signout", { method: "POST" })
	window.location.href = "/sign-in"
}
```

### Protected API Routes

To protect API routes, check for the auth cookie:

```typescript
import { cookies } from "next/headers"

export async function GET(request: Request) {
	const authCookie = cookies().get("auth_session")

	if (!authCookie || authCookie.value !== "authenticated") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	// Handle authenticated request...
}
```

## Best Practices

1. **Environment Variables**

    - Never commit credentials to version control
    - Use strong, unique passwords
    - Rotate credentials periodically

2. **Cookie Security**

    - Always use HTTP-only cookies
    - Enable secure flag in production
    - Implement proper CSRF protection

3. **Error Handling**

    - Provide clear error messages
    - Log authentication failures
    - Implement rate limiting

4. **Session Management**
    - Implement session expiration
    - Allow manual session termination
    - Clear sessions on password change

## Limitations

1. Simple authentication system suitable for admin-only applications
2. No password hashing (relies on environment variables)
3. No multi-user support
4. No password reset functionality

## Future Improvements

1. Implement password hashing
2. Add multi-user support
3. Add password reset functionality
4. Implement rate limiting
5. Add refresh token mechanism
6. Add remember me functionality
