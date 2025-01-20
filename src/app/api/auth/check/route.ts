import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
	const cookieStore = await cookies()
	const authCookie = cookieStore.get("auth_session")

	if (!authCookie || authCookie.value !== "authenticated") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
	}

	return NextResponse.json({ authenticated: true })
}
