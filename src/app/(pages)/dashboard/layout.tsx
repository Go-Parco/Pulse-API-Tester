import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { cookies } from "next/headers"
import parcoLogo from "@/assets/branding/parco_large.png"
import Image from "next/image"
import { X } from "lucide-react"

export default async function PagesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const authCookie = cookieStore.get("auth_session")
	const isAuthenticated = authCookie?.value === "authenticated"
	const pathname = children?.toString() || ""
	const isPublicPage = pathname.includes("sign-in") || pathname === "/"

	if (!isAuthenticated || isPublicPage) {
		return children
	}

	return (
		<div className="relative">
			<SidebarProvider defaultOpen>
				<div className="grid min-h-screen grid-cols-[auto_1fr]">
					<AppSidebar />
					<div className="flex flex-col">
						<header className="sticky top-0 z-10 border-b bg-background px-6 py-3 shadow-sm">
							<div className="flex gap-8 my-4 justify-center items-center">
								<Image
									className=""
									src={parcoLogo}
									alt="Parco Logo"
									width={180}
									height={38}
									priority
								/>
								<X className="w-8 h-auto my-auto text-zinc-400" />
								<Image
									className="mt-2"
									src="/next.svg"
									alt="Next.js logo"
									width={180}
									height={38}
									priority
								/>
							</div>
						</header>
						<main className="flex-1 overflow-y-auto p-6">
							{children}
						</main>
					</div>
				</div>
			</SidebarProvider>
		</div>
	)
}
