import { createUploadthing, type FileRouter } from "uploadthing/next"

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({ pdf: { maxFileSize: "32MB" } })
		.middleware(() => ({}))
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
