import { createCallerFactory, createTRPCRouter } from "@/server/trpc"
import { exampleRouter } from "./routers/example"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
	example: exampleRouter,
})

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)

// export type definition of API
export type AppRouter = typeof appRouter
