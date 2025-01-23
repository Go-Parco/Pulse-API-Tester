import { NextResponse } from "next/server"
import { env } from "@/env"

export async function POST() {
	const response = NextResponse.json({ success: true })

	// Remove the auth cookie
	response.cookies.set("auth_session", "", {
		httpOnly: true,
		secure: env.NEXT_PUBLIC_NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0, // Expire immediately
	})

	return response
}
