import type { NextApiRequest, NextApiResponse } from "next"
import { clearSession, validateSession } from "@/lib/auth"

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") {
		return res.status(405).json({ error: "Method not allowed" })
	}

	if (!validateSession(req)) {
		return res.status(401).json({ error: "Unauthorized" })
	}

	try {
		clearSession(res)
		return res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		return res.status(500).json({
			error: "An unknown error occurred",
		})
	}
}
