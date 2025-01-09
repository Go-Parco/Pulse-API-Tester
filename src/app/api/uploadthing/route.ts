import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./config"

export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
})
