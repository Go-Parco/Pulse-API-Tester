import { z } from "zod"
import dotenv from "dotenv"

dotenv.config()

const envSchema = z.object({
	AUTH_SECRET: z.string().min(1),
	DATABASE_URL: z.string().url(),
	APPLE_KEY_ID: z.string().optional(),
	APPLE_TEAM_ID: z.string().optional(),
	APPLE_CLIENT_ID: z.string().optional(),
	APPLE_PRIVATE_KEY: z.string().optional(),
	APPLE_SECRET: z.string().optional(),
	AWS_ACCESS_KEY_ID: z.string().min(1),
	AWS_SECRET_ACCESS_KEY: z.string().min(1),
	SENTRY_AUTH_TOKEN: z.string().optional(),
	GOOGLE_CLIENT_ID: z.string().optional(),
	GOOGLE_CLIENT_SECRET: z.string().optional(),
	GITHUB_CLIENT_ID: z.string().optional(),
	GITHUB_CLIENT_SECRET: z.string().optional(),
	AUTH_DISCORD_ID: z.string().optional(),
	AUTH_DISCORD_SECRET: z.string().optional(),
})

envSchema.parse(process.env)
console.log("✅ Environment variables are valid")
