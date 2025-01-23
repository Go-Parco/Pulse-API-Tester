import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/api/root"
import { createContext } from "@/server/context"
import { env } from "@/env"

const handler = (req: Request) =>
	fetchRequestHandler({
		endpoint: "/api/trpc",
		req,
		router: appRouter,
		createContext: () =>
			createContext({
				req,
				resHeaders: new Headers(),
			}),
		onError:
			env.NEXT_PUBLIC_NODE_ENV === "development"
				? ({ path, error }) => {
						console.error(
							`❌ tRPC failed on ${path ?? "<no-path>"}: ${
								error.message
							}`
						)
				  }
				: undefined,
	})

export { handler as GET, handler as POST }
