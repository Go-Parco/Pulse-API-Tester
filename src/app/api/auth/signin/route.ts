import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { env } from "@/env"

const ADMIN_EMAIL = env.ADMIN_EMAIL
const ADMIN_PASSWORD = env.ADMIN_PASSWORD

export async function POST(request: Request) {
	try {
		const { email, password } = await request.json()

		// Validate credentials
		if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
			return NextResponse.json(
				{ error: "Invalid credentials" },
				{ status: 401 }
			)
		}

		// Set authentication cookie
		const response = NextResponse.json({ success: true })
		response.cookies.set("auth_session", "authenticated", {
			httpOnly: true,
			secure: env.NEXT_PUBLIC_NODE_ENV === "production",
			sameSite: "lax",
			path: "/",
			// Set cookie to expire in 24 hours
			maxAge: 60 * 60 * 24,
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
