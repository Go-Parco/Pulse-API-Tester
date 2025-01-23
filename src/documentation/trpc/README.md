# TRPC Setup in Pulse API Demo

> Official tRPC Documentation: [https://trpc.io/docs](https://trpc.io/docs)

## What is tRPC?

tRPC (TypeScript Remote Procedure Call) enables you to build fully type-safe APIs without schemas or code generation. It creates a seamless end-to-end type-safe API layer between your client and server.

### Benefits

1. **End-to-end Type Safety**: All API calls are fully typed, providing autocomplete and type checking across your entire application.
2. **Zero Schema Maintenance**: No need to maintain separate API schemas or types - TypeScript types flow automatically from your API routes to your client.
3. **Better Developer Experience**: Get immediate feedback on API changes, catch errors at compile time instead of runtime.
4. **Smaller Bundle Size**: No runtime validation overhead, as type checking happens during development.

### Why tRPC in Pulse API Demo?

This application handles complex document processing with multiple API integrations (Pulse API, Nyckel, etc.). tRPC helps us by:

1. **Type-safe Environment Variables**: Ensuring all API keys and configurations are properly typed and validated.
2. **Secure API Routes**: Built-in authentication checks with protected procedures.
3. **Streamlined Data Flow**: Seamless integration between Next.js server components and client-side code.
4. **Better Error Handling**: Type-safe error responses and consistent error handling patterns.

This document outlines how TRPC is implemented in the Pulse API Demo application, including environment variable handling and API route configuration.

## Directory Structure

```
src/
├── server/
│   ├── api/           # TRPC router definitions
│   ├── context.ts     # API context and auth
│   ├── env.ts         # Environment variable validation
│   └── trpc.ts        # TRPC initialization
└── utils/
    └── api.ts         # Client-side TRPC hooks
```

## Environment Variables

We use Zod for runtime type validation of environment variables. This ensures type safety and autocompletion throughout the application.

### Setup (`env.ts`)

```typescript
import { z } from "zod"

// Define schema for environment variables
export const serverEnvSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]),
	NEXTAUTH_URL: z.string().url(),
	NEXTAUTH_SECRET: z.string(),
	PULSE_API_KEY: z.string(),
	NYCKEL_API_KEY: z.string(),
	UPLOADTHING_SECRET: z.string(),
	UPLOADTHING_APP_ID: z.string(),
	DATABASE_URL: z.string(),
})

// Define schema for client-side environment variables
export const clientEnvSchema = z.object({
	NEXT_PUBLIC_PULSE_API_KEY: z.string(),
	NEXT_PUBLIC_NYCKEL_API_KEY: z.string(),
})

// Validate environment variables at runtime
export const env = {
	...serverEnvSchema.parse(process.env),
	...clientEnvSchema.parse(process.env),
}
```

## TRPC Setup

### Server Initialization (`trpc.ts`)

```typescript
import { initTRPC, TRPCError } from "@trpc/server"
import { Context } from "./context"

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure
export const middleware = t.middleware

// Protected procedure example
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
	if (!ctx.session?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	return next({
		ctx: {
			...ctx,
			session: ctx.session,
		},
	})
})
```

### API Context (`context.ts`)

```typescript
import { inferAsyncReturnType } from "@trpc/server"
import { getSession } from "next-auth/react"
import { env } from "./env"

export async function createContext({ req, res }) {
	const session = await getSession({ req })

	return {
		req,
		res,
		session,
		env, // Typed environment variables available in context
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
```

## Usage in Routes

### Creating a Router

```typescript
// src/server/api/routers/example.ts
import { router, publicProcedure, protectedProcedure } from "../trpc"
import { z } from "zod"

export const exampleRouter = router({
	public: publicProcedure
		.input(z.object({ text: z.string() }))
		.query(({ input, ctx }) => {
			// Access typed env variables
			const apiKey = ctx.env.PULSE_API_KEY
			return {
				text: `Hello ${input.text}`,
			}
		}),

	protected: protectedProcedure.mutation(async ({ ctx }) => {
		// Only accessible to authenticated users
		return { userId: ctx.session.user.id }
	}),
})
```

### Root Router Configuration

```typescript
// src/server/api/root.ts
import { router } from "../trpc"
import { exampleRouter } from "./routers/example"

export const appRouter = router({
	example: exampleRouter,
})

export type AppRouter = typeof appRouter
```

## Client-Side Usage

### TRPC Provider Setup

```typescript
// src/app/providers.tsx
import { httpBatchLink } from "@trpc/client"
import { createTRPCNext } from "@trpc/next"
import type { AppRouter } from "@/server/api/root"

export const trpc = createTRPCNext<AppRouter>({
	config() {
		return {
			links: [
				httpBatchLink({
					url: "/api/trpc",
				}),
			],
		}
	},
})
```

### Using TRPC in Components

```typescript
import { trpc } from "@/utils/api"

export function MyComponent() {
	// Query with automatic type inference
	const { data } = trpc.example.public.useQuery({ text: "world" })

	// Mutation with automatic type inference
	const mutation = trpc.example.protected.useMutation()

	return <div>{data?.text}</div>
}
```

## Environment Variables

Create a `.env` file in the root directory with these variables:

```env
# Server-side variables
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret
PULSE_API_KEY=your-pulse-api-key
NYCKEL_API_KEY=your-nyckel-api-key
UPLOADTHING_SECRET=your-uploadthing-secret
UPLOADTHING_APP_ID=your-uploadthing-app-id
DATABASE_URL=your-database-url

# Client-side variables (must start with NEXT_PUBLIC_)
NEXT_PUBLIC_PULSE_API_KEY=your-public-pulse-api-key
NEXT_PUBLIC_NYCKEL_API_KEY=your-public-nyckel-api-key
```

## Type Safety

-   All environment variables are validated at runtime using Zod
-   TRPC procedures have full type inference for inputs and outputs
-   Environment variables are available in the TRPC context with proper typing
-   Client-side hooks provide automatic type inference for all API calls

## Best Practices

1. Always use Zod schemas for input validation
2. Keep sensitive environment variables server-side only
3. Use protected procedures for authenticated routes
4. Leverage the type system for better developer experience
5. Use the context to access environment variables instead of process.env directly

## Common Issues

1. **Environment Variables Not Loading**

    - Ensure `.env` file is in the root directory
    - Restart the development server after changes
    - Check that all required variables are defined

2. **Type Errors**

    - Make sure all environment variables are properly typed in `env.ts`
    - Use proper input/output types for TRPC procedures
    - Check that client-side usage matches server-side definitions

3. **Authentication Issues**
    - Verify NEXTAUTH_URL and NEXTAUTH_SECRET are properly set
    - Check that protected procedures are using the correct middleware
    - Ensure session handling is properly configured
