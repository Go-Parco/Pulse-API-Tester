import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { appRouter } from "@/server/api/root"
import { createContext } from "@/server/context"
import { env } from "@/env"
import { SafeLog } from "@/utils/SafeLog"

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
						SafeLog({
							display: false,
							log: {
								"TRPC Error": {
									path: path ?? "<no-path>",
									message: error.message,
								},
							},
						})
				  }
				: undefined,
	})

export { handler as GET, handler as POST }
