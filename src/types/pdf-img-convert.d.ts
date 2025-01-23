declare module "pdf-img-convert" {
	interface ConvertOptions {
		base64?: boolean
		scale?: number
		page_numbers?: number[]
	}

	function convert(
		pdfBuffer: Buffer,
		options?: ConvertOptions
	): Promise<string[]>

	export { convert, ConvertOptions }
}
