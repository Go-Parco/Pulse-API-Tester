import { NextResponse } from "next/server"
import { createWorker } from "tesseract.js"

export async function POST(request: Request) {
	try {
		const formData = await request.formData()
		const file = formData.get("file") as File

		if (!file) {
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			)
		}

		console.log("Converting file to buffer...")
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		console.log("Starting OCR...")
		const worker = await createWorker("eng", 1, {
			logger: (m) => console.log(m),
		})

		const { data } = await worker.recognize(buffer)
		console.log("Recognition complete, cleaning up...")
		await worker.terminate()

		console.log("Text length:", data.text.length)
		return NextResponse.json({
			success: true,
			text: data.text,
		})
	} catch (error: unknown) {
		console.error("OCR Error:", error)
		return NextResponse.json(
			{ error: "Failed to process image" },
			{ status: 500 }
		)
	}
}
