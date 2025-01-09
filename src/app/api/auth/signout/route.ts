import { NextResponse } from "next/server"

export async function POST() {
	const response = NextResponse.json({ success: true })

	// Remove the auth cookie
	response.cookies.set("auth_session", "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0, // Expire immediately
	})

	return response
}
