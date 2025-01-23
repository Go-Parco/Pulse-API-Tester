import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import sharp from "sharp"

export const pdfRouter = createTRPCRouter({
	convert: publicProcedure
		.input(
			z.object({
				file: z.instanceof(File),
			})
		)
		.mutation(async ({ input }) => {
			const { file } = input

			console.log("Processing file:", {
				name: file.name,
				type: file.type,
				size: file.size,
			})

			try {
				// Convert File to Buffer
				const buffer = Buffer.from(await file.arrayBuffer())
				console.log("File converted to buffer")

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
				console.log("Conversion completed")

				return {
					base64Image: `data:image/png;base64,${base64Image}`,
				}
			} catch (error) {
				console.error("PDF conversion failed:", error)
				throw new Error(
					error instanceof Error
						? error.message
						: "Failed to convert PDF"
				)
			}
		}),
})
