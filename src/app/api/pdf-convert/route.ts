import { NextResponse } from "next/server"
import sharp from "sharp"
import { SafeLog } from "@/utils/SafeLog"

export const maxDuration = 300
export const dynamic = "force-dynamic"

type ConversionError = Error & {
	stack?: string
}

export async function POST(request: Request) {
	try {
		SafeLog({
			display: false,
			log: { Status: "Starting PDF conversion request..." },
		})
		const formData = await request.formData()
		const file = formData.get("file") as File

		if (!file) {
			SafeLog({
				display: false,
				log: { "Conversion error": { message: "No file provided" } },
			})
			return NextResponse.json(
				{ error: "No file provided" },
				{ status: 400 }
			)
		}

		SafeLog({
			display: false,
			log: {
				"Processing file": {
					name: file.name,
					type: file.type,
					size: file.size,
				},
			},
		})

		try {
			// Convert File to Buffer
			const buffer = Buffer.from(await file.arrayBuffer())
			SafeLog({
				display: false,
				log: { Status: "File converted to buffer" },
			})

			// Create a white image with placeholder text
			const width = 2000
			const height = Math.floor(width * 1.414) // A4 aspect ratio

			const svg = `
				<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
					<rect width="100%" height="100%" fill="white"/>
					<text x="50%" y="50%" text-anchor="middle" font-family="Arial" font-size="24" fill="black">
						PDF Preview Not Available
					</text>
				</svg>
			`

			const image = await sharp(Buffer.from(svg))
				.resize(width, height)
				.png()
				.toBuffer()

			// Convert to base64
			const base64Image = image.toString("base64")
			SafeLog({ display: false, log: { Status: "Conversion completed" } })

			return NextResponse.json({
				base64Image: `data:image/png;base64,${base64Image}`,
			})
		} catch (err) {
			const conversionError = err as ConversionError
			SafeLog({
				display: false,
				log: {
					"Conversion error": {
						message: conversionError.message,
						stack: conversionError.stack,
					},
				},
			})
			throw conversionError
		}
	} catch (err) {
		const error = err as ConversionError
		SafeLog({ display: false, log: { "PDF conversion failed": error } })
		return NextResponse.json(
			{
				error: "Failed to convert PDF",
				details: error.message || "Unknown error",
			},
			{ status: 500 }
		)
	}
}
