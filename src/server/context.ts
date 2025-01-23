import { inferAsyncReturnType } from "@trpc/server"
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: FetchCreateContextFnOptions) {
	const cookieHeader = opts.req.headers.get("cookie") || ""
	const isAuthenticated = cookieHeader.includes("auth_session=authenticated")

	return {
		req: opts.req,
		resHeaders: opts.resHeaders,
		isAuthenticated,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
