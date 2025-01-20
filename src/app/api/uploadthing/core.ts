import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

// Simple auth function (you can enhance this)
const auth = (req: Request) => ({ id: "fakeId" })

export const ourFileRouter = {
	imageUploader: f({
		pdf: { maxFileSize: "8MB", maxFileCount: 1 },
		image: { maxFileSize: "8MB", maxFileCount: 1 },
	})
		.middleware(async ({ req }) => {
			const user = await auth(req)
			if (!user) throw new UploadThingError("Unauthorized")
			return { userId: user.id }
		})
		.onUploadComplete(async ({ metadata, file }) => {
			console.log("Upload complete for userId:", metadata.userId)
			console.log("file url", file.url)

			return {
				url: file.url,
				uploadedBy: metadata.userId,
			}
		}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
