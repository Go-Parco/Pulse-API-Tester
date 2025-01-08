import type { NextApiRequest, NextApiResponse } from "next"
import { validateCredentials, createSession } from "@/lib/auth"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	const { email, password } = req.body

	if (!validateCredentials(email, password)) {
		return res.status(401).json({ error: "Invalid credentials" })
	}

	try {
		createSession(res)
		return res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "An unknown error occurred",
		})
	}
}
