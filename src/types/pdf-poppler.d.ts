declare module "pdf-poppler" {
	interface ConvertOptions {
		format?: "png" | "jpeg"
		out_dir: string
		out_prefix: string
		page?: number
	}

	export const pdf2image: {
		convert: (pdfPath: string, options: ConvertOptions) => Promise<void>
	}
}
