import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UTApi } from "uploadthing/server"

const f = createUploadthing()

export const ourFileRouter = {
	imageUploader: f({ pdf: { maxFileSize: "32MB" } })
		.middleware(() => ({}))
		.onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

export const uploadthing = createUploadthing()

// Create a new instance of UTApi
export const utapi = new UTApi()
