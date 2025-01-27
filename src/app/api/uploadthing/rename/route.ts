import { NextResponse } from "next/server"
import { utapi } from "../config"
import { SafeLog } from "@/utils/SafeLog"

export async function POST(request: Request) {
	try {
		const body = await request.json()
		SafeLog({ display: false, log: { "Rename request body": body } })

		if (!body.fileKey || !body.newName) {
			SafeLog({
				display: false,
				log: { Error: "Missing fileKey or newName in request body" },
			})
			return NextResponse.json(
				{ error: "Missing fileKey or newName" },
				{ status: 400 }
			)
		}

		// Rename the file using the file key
		SafeLog({
			display: false,
			log: {
				"Renaming file": {
					fileKey: body.fileKey,
					newName: body.newName,
				},
			},
		})

		const result = await utapi.renameFiles({
			fileKey: body.fileKey,
			newName: body.newName,
		})

		SafeLog({ display: false, log: { "Rename operation result": result } })

		return NextResponse.json({
			success: true,
			result,
		})
	} catch (error) {
		SafeLog({
			display: false,
			log: { "Error in rename route": error },
		})
		return NextResponse.json(
			{ error: "Failed to rename file" },
			{ status: 500 }
		)
	}
}
