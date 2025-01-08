import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({
		pdf: { maxFileSize: "8MB" },
	})
		.middleware(({ req }) => {
			return { userId: "test" }
		})
		.onUploadComplete(({ file }) => {
			console.log(
				"Upload complete. File type:",
				file.type,
				"URL:",
				file.url
			)
			return { url: file.url }
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
