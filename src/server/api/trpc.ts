import { initTRPC } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import superjson from "superjson"

export const createTRPCContext = async (opts: FetchCreateContextFnOptions) => {
	return {
		...opts,
	}
}

const t = initTRPC.context<typeof createTRPCContext>().create({
	transformer: superjson,
	errorFormatter({ shape, error }) {
		return {
			...shape,
			data: {
				...shape.data,
				zodError:
					error.cause instanceof Error ? error.cause.message : null,
			},
		}
	},
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
