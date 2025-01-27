import { NextResponse } from "next/server"
import { createWorker } from "tesseract.js"
import { SafeLog } from "@/utils/SafeLog"

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

		SafeLog({
			display: false,
			log: { Status: "Converting file to buffer..." },
		})
		const arrayBuffer = await file.arrayBuffer()
		const buffer = Buffer.from(arrayBuffer)

		SafeLog({ display: false, log: { Status: "Starting OCR..." } })
		const worker = await createWorker("eng", 1, {
			logger: (m) =>
				SafeLog({ display: false, log: { "Tesseract Progress": m } }),
		})

		const { data } = await worker.recognize(buffer)
		SafeLog({
			display: false,
			log: { Status: "Recognition complete, cleaning up..." },
		})
		await worker.terminate()

		SafeLog({ display: false, log: { "Text length": data.text.length } })
		return NextResponse.json({
			success: true,
			text: data.text,
		})
	} catch (error: unknown) {
		SafeLog({ display: false, log: { "OCR Error": error } })
		return NextResponse.json(
			{ error: "Failed to process image" },
			{ status: 500 }
		)
	}
}
