"use client"

import posthog from "posthog-js"
import { PostHogProvider } from "posthog-js/react"
import { ReactNode } from "react"
import { ThemeProvider } from "./themeProvider"
import { env } from "@/env"

if (typeof window !== "undefined") {
	posthog.init(env.NEXT_PUBLIC_POSTHOG_KEY, {
		api_host: env.NEXT_PUBLIC_POSTHOG_HOST,
		capture_pageview: false,
	})
}

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange>
			<PostHogProvider client={posthog}>{children}</PostHogProvider>
		</ThemeProvider>
	)
}
