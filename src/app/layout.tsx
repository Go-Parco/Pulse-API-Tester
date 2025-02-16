import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from "@/components/ui/sonner"
import "./styles/globals.css"
import { TRPCProvider } from "./providers"
import { NuqsAdapter } from "nuqs/adapters/next/app"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
})

export const metadata: Metadata = {
	title: "Parco OCR Functions",
	description: "Testing and Demo Dashboard for Parco OCR Functions",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en" className="light">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<TRPCProvider>
					<NuqsAdapter>{children}</NuqsAdapter>
				</TRPCProvider>
				<Toaster />
				<SonnerToaster />
			</body>
		</html>
	)
}
