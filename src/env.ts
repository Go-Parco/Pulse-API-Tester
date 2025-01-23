import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod"

const clientSchema = {
	NEXT_PUBLIC_POSTHOG_KEY: z.string().min(1),
	NEXT_PUBLIC_POSTHOG_HOST: z.string().url(),
	NEXT_PUBLIC_PULSE_API_KEY: z.string(),
	NEXT_PUBLIC_NYCKEL_API_KEY: z.string().optional(),
	NEXT_PUBLIC_NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
} as const

const serverSchema = {
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	AWS_ACCESS_KEY_ID: z.string(),
	AWS_SECRET_ACCESS_KEY: z.string(),
	AWS_REGION: z.string(),
	S3_BUCKET_NAME: z.string(),
	PULSE_API_KEY: z.string(),
	NYCKEL_API_KEY: z.string(),
	ADMIN_EMAIL: z.string().email(),
	ADMIN_PASSWORD: z.string(),
	UPLOADTHING_TOKEN: z.string(),
	SENTRY_AUTH_TOKEN: z.string(),
	PORT: z.string().optional(),
} as const

export const env = createEnv({
	server: serverSchema,
	client: clientSchema,
	/**
	 * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
	 * middlewares) or client-side so we need to destruct manually.
	 */
	runtimeEnv: {
		// System
		NODE_ENV: process.env.NODE_ENV,
		PORT: process.env.PORT,
		// AWS
		AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
		AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
		AWS_REGION: process.env.AWS_REGION,
		S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
		// API Keys
		PULSE_API_KEY: process.env.PULSE_API_KEY,
		NEXT_PUBLIC_PULSE_API_KEY: process.env.NEXT_PUBLIC_PULSE_API_KEY,
		NYCKEL_API_KEY: process.env.NYCKEL_API_KEY,
		NEXT_PUBLIC_NYCKEL_API_KEY: process.env.NEXT_PUBLIC_NYCKEL_API_KEY,
		// Admin
		ADMIN_EMAIL: process.env.ADMIN_EMAIL,
		ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
		// Services
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
		NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
		NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
		SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
		// Node Env for client
		NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
	},
	/**
	 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
	 * useful for Docker builds.
	 */
	skipValidation: !!process.env.SKIP_ENV_VALIDATION,
	/**
	 * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
	 * `SOME_VAR=''` will throw an error.
	 */
	emptyStringAsUndefined: true,
})
