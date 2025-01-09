import { NextApiRequest, NextApiResponse } from "next"
import { NextRequest } from "next/server"
import { serialize, parse } from "cookie"

// Admin credentials stored in environment variables
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD

const SESSION_NAME = "admin_session"
const SESSION_VALUE = "authenticated"

export function createSession(res: NextApiResponse) {
	const cookie = serialize(SESSION_NAME, SESSION_VALUE, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24, // 24 hours
	})

	res.setHeader("Set-Cookie", cookie)
}

export function clearSession(res: NextApiResponse) {
	const cookie = serialize(SESSION_NAME, "", {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		path: "/",
		maxAge: 0,
	})

	res.setHeader("Set-Cookie", cookie)
}

export function validateSession(req: NextApiRequest | NextRequest): boolean {
	if (req instanceof Request) {
		// NextRequest case
		return req.cookies.get(SESSION_NAME)?.value === SESSION_VALUE
	}
	// NextApiRequest case
	const cookies = parse(req.headers.cookie || "")
	return cookies[SESSION_NAME] === SESSION_VALUE
}

export function validateCredentials(email: string, password: string): boolean {
	return email === ADMIN_EMAIL && password === ADMIN_PASSWORD
}
