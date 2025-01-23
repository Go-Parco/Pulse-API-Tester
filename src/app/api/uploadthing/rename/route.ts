import { NextResponse } from "next/server"
import { utapi } from "../config"

export async function POST(req: Request) {
	try {
		const { originalName, newName } = await req.json()
		console.log("Rename request received:", { originalName, newName })

		if (!originalName || !newName) {
			console.log("Missing required fields:", { originalName, newName })
			return NextResponse.json(
				{ error: "Missing originalName or newName" },
				{ status: 400 }
			)
		}

		// Get the file key from the original name
		console.log("Fetching files from UploadThing...")
		const { files } = await utapi.listFiles()
		console.log("Files retrieved:", files.length)

		const file = files.find((f) => f.name === originalName)
		console.log("Found file:", file)

		if (!file) {
			console.log("File not found:", originalName)
			return NextResponse.json(
				{ error: "Original file not found" },
				{ status: 404 }
			)
		}

		// Rename the file using the file key
		console.log("Attempting to rename file:", {
			fileKey: file.key,
			newName: newName,
		})

		const result = await utapi.renameFiles({
			fileKey: file.key,
			newName: newName,
		})
		console.log("Rename operation result:", result)

		return NextResponse.json({
			success: true,
			result,
		})
	} catch (error) {
		console.error("Error in rename route:", error)
		return NextResponse.json(
			{ error: "Failed to rename file" },
			{ status: 500 }
		)
	}
}
