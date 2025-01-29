"use client"

import {
	Activity,
	BookType,
	Calendar,
	ChevronUp,
	CircleDollarSign,
	Code,
	FileImage,
	FileText,
	FileType,
	FolderPen,
	Home,
	Infinity,
	Info,
	LogOut,
	Menu,
	Newspaper,
	PanelLeftDashed,
	Pickaxe,
	ScanEye,
	Search,
	Shovel,
	Snail,
	SquareFunction,
	Table,
	Tally5,
	Text,
} from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarTrigger,
	useSidebar,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { useState, useEffect } from "react"
import { LucideIcon } from "lucide-react"
import Link from "next/link"
import { SafeLog } from "@/utils/SafeLog"

type MenuItem = {
	title: string
	url: string
	icon: LucideIcon
}

type Section = {
	id: string
	title: string
	disabled?: boolean
	icon: LucideIcon
	iconBgColor: string
	iconColor: string
	items: MenuItem[]
}

type SectionGroup = {
	id: string
	title: string
	link?: string
	sections: Section[]
}

const sectionGroups: SectionGroup[] = [
	{
		id: "home",
		title: "Home",
		link: "/dashboard",
		sections: [
			{
				id: "dashboard",
				title: "Dashboard",
				icon: Home,
				iconBgColor: "bg-indigo-100",
				iconColor: "text-indigo-600",
				items: [
					{
						title: "Welcome",
						url: "/dashboard",
						icon: Info,
					},
				],
			},
		],
	},
	{
		id: "apis",
		title: "APIs",
		sections: [
			{
				id: "textract",
				title: "Textract",
				icon: FileType,
				iconBgColor: "bg-amber-100",
				iconColor: "text-amber-600",
				items: [
					{
						title: "Form & Table Output",
						url: "/dashboard/api_pages/textract/form-table-output",
						icon: Newspaper,
					},
				],
			},
			{
				id: "tesseract",
				title: "Tesseract.js",
				// disabled: true,
				icon: Code,
				iconBgColor: "bg-fuchsia-100",
				iconColor: "text-fuchsia-600",
				items: [
					{
						title: "OCR with Search",
						url: "/dashboard/api_pages/tesseract/ocr-with-search",
						icon: Text,
					},
				],
			},
			{
				id: "pulse",
				title: "Pulse",
				icon: Activity,
				iconBgColor: "bg-blue-100",
				iconColor: "text-blue-600",
				items: [
					{
						title: "Extract",
						url: "/dashboard/api_pages/pulse/extract",
						icon: Pickaxe,
					},
					{
						title: "Extract Async",
						url: "/dashboard/api_pages/pulse/extract_async",
						icon: Shovel,
					},
				],
			},
			{
				id: "nyckel",
				title: "Nyckel",
				icon: CircleDollarSign,
				iconBgColor: "bg-green-100",
				iconColor: "text-green-600",
				items: [
					{
						title: "Document Type Identifier",
						url: "/dashboard/api_pages/nyckel/document_type_identifier",
						icon: Search,
					},
				],
			},
		],
	},
	{
		id: "fctns",
		title: "Functions",
		sections: [
			{
				id: "fctn-section",
				title: "OCR Functions",
				icon: ScanEye,
				iconBgColor: "bg-red-100",
				iconColor: "text-purple-600",
				items: [
					{
						title: "Document Rename",
						url: "/dashboard/functions/ocr/document-rename",
						icon: FolderPen,
					},
				],
			},
			{
				id: "gen-fctn-section",
				title: "General Functions",
				icon: SquareFunction,
				iconBgColor: "bg-zinc-100",
				iconColor: "text-zinc-600",
				items: [
					{
						title: "PDF Page Count",
						url: "/dashboard/functions/general/pdf-page-count",
						icon: Tally5,
					},
					{
						title: "PDF to Img",
						url: "/dashboard/functions/general/pdf-to-img",
						icon: FileText,
					},
					{
						title: "Img to JPG",
						url: "/dashboard/functions/general/img-to-jpg",
						icon: FileImage,
					},
				],
			},
			{
				id: "legacy-functions",
				title: "Legacy Functions",
				icon: Snail,
				iconBgColor: "bg-teal-100",
				iconColor: "text-teal-600",
				items: [
					{
						title: "Query Conversion",
						url: "/dashboard/functions/ocr/legacy/query-conversion",
						icon: Table,
					},
					{
						title: "Manual File Rename",
						url: "/dashboard/functions/ocr/legacy/manual-file-rename",
						icon: BookType,
					},
					{
						title: "Mock API Limit",
						url: "/dashboard/functions/ocr/legacy/mock-api-limit",
						icon: Infinity,
					},
				],
			},
		],
	},
]

const getInitialExpandedSections = (groups: SectionGroup[]) => {
	return Object.fromEntries(
		groups.flatMap((group) =>
			group.sections.map((section) => [section.id, false])
		)
	)
}

export function AppSidebar() {
	const router = useRouter()
	const { setOpen, state, setOpenMobile } = useSidebar()
	const isCollapsed = state === "collapsed"
	const [expandedSections, setExpandedSections] = useState<
		Record<string, boolean>
	>(getInitialExpandedSections(sectionGroups))
	const pathname = usePathname()

	const isCurrentPath = (url: string) => pathname === url

	const sectionContainsCurrentPath = (section: Section) => {
		return section.items.some((item) => isCurrentPath(item.url))
	}

	const groupContainsCurrentPath = (group: SectionGroup) => {
		return group.sections.some(sectionContainsCurrentPath)
	}

	const toggleSection = (sectionId: string, e: React.MouseEvent) => {
		const target = e.target as HTMLElement
		if (
			target.closest(".icon-container") &&
			target.closest('[data-state="collapsed"]')
		) {
			setOpen(true)
		} else {
			setExpandedSections((prev) => ({
				...prev,
				[sectionId]: !prev[sectionId],
			}))
		}
	}

	const handleSignOut = async () => {
		try {
			const response = await fetch("/api/auth/signout", {
				method: "POST",
			})

			if (!response.ok) {
				throw new Error("Failed to sign out")
			}

			router.push("/sign-in")
		} catch (error) {
			SafeLog({ display: false, log: { "Sign out error": error } })
		}
	}

	return (
		<>
			<button
				onClick={() => {
					setOpenMobile(true)
				}}
				className="z-50 rounded-md h-fit w-fit ml-4 mt-4 md:hidden shadow-black/30 lg:hidden p-2 hover:bg-accent bg-white my-2">
				<PanelLeftDashed className="h-5 w-5" />
			</button>
			<Sidebar variant="sidebar" collapsible="icon">
				<SidebarContent className="flex flex-col h-full relative bg-white">
					<div className="relative">
						<div className="absolute top-2 right-2 z-10 data-[state=collapsed]:right-auto data-[state=collapsed]:left-[0.6rem] lg:block">
							<SidebarTrigger className="data-[state=closed]:absolute data-[state=closed]:-right-10 data-[state=closed]:top-0" />
						</div>
					</div>
					<div className="flex flex-col h-full">
						<div className="flex-1 pt-2 mt-6 overflow-y-auto pb-[120px]">
							<SidebarGroup>
								<SidebarGroupLabel className="text-xl font-bold sr-only px-2 py-4 mb-6 data-[state=collapsed]:hidden">
									APIs
								</SidebarGroupLabel>
								<SidebarGroupContent>
									<SidebarMenu>
										<div className="space-y-8">
											{sectionGroups.map((group) => (
												<div
													key={group.id}
													className="space-y-6">
													<SidebarGroupLabel
														className={cn(
															"text-xl font-bold px-2 py-4 data-[state=collapsed]:hidden",
															!isCollapsed &&
																groupContainsCurrentPath(
																	group
																) &&
																"text-blue-600"
														)}>
														<Link
															className={`${
																group.link
																	? "hover:text-blue-600"
																	: "cursor-default"
															}`}
															href={
																group.link
																	? group.link
																	: "#"
															}>
															{group.title}
														</Link>
													</SidebarGroupLabel>
													{group.sections.map(
														(section) => (
															<div
																key={
																	section.id
																}>
																<button
																	onClick={(
																		e
																	) =>
																		toggleSection(
																			section.id,
																			e
																		)
																	}
																	disabled={Boolean(
																		section.disabled
																	)}
																	className={cn(
																		"w-full flex items-center gap-2 mb-2 group",
																		section.disabled
																			? "opacity-50 cursor-not-allowed"
																			: ""
																	)}>
																	<div
																		className={cn(
																			"icon-container flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center",
																			section.iconBgColor
																		)}>
																		<section.icon
																			className={cn(
																				"h-4 w-4",
																				section.iconColor
																			)}
																		/>
																	</div>
																	<span
																		className={cn(
																			"text-lg font-medium hover:pl-1 flex-1 text-left text-sidebar-foreground/70 data-[state=collapsed]:hidden ease-in duration-200 transition-all",
																			!expandedSections[
																				section
																					.id
																			] &&
																				sectionContainsCurrentPath(
																					section
																				) &&
																				"text-blue-600"
																		)}>
																		{
																			section.title
																		}
																	</span>
																	<ChevronUp
																		className={cn(
																			"h-4 w-4 text-sidebar-foreground/70 transition-transform data-[state=collapsed]:hidden",
																			{
																				"rotate-180":
																					!expandedSections[
																						section
																							.id
																					],
																			}
																		)}
																	/>
																</button>
																<div
																	className={cn(
																		"space-y-1 transition-all",
																		{
																			hidden: !expandedSections[
																				section
																					.id
																			],
																			"opacity-50 pointer-events-none":
																				Boolean(
																					section.disabled
																				),
																		}
																	)}>
																	{section.items.map(
																		(
																			item
																		) => {
																			const isActive =
																				pathname ===
																				item.url

																			return (
																				<SidebarMenuItem
																					key={
																						item.title
																					}>
																					<SidebarMenuButton
																						asChild>
																						<Link
																							href={
																								item.url
																							}
																							className={cn(
																								"peer/menu-button flex w-full items-center gap-2 overflow-hidden relative transition-colors duration-200",
																								section.disabled &&
																									"pointer-events-none",
																								isActive &&
																									"text-blue-600",
																								!isActive &&
																									"hover:text-blue-500/70"
																							)}>
																							{isActive &&
																								!isCollapsed && (
																									<div className="absolute left-[-12px] w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
																								)}
																							<TooltipProvider>
																								<Tooltip>
																									<TooltipTrigger
																										asChild>
																										<item.icon
																											className={cn(
																												"h-4 w-4 text-zinc-500",
																												isActive &&
																													"text-blue-600"
																											)}
																										/>
																									</TooltipTrigger>
																									<TooltipContent
																										side="right"
																										className="data-[state=expanded]:hidden">
																										{
																											item.title
																										}
																									</TooltipContent>
																								</Tooltip>
																							</TooltipProvider>
																							<span
																								className={cn(
																									"text-base data-[state=collapsed]:hidden text-zinc-600 transition-colors duration-200",
																									isActive &&
																										"font-medium text-blue-600",
																									!isActive &&
																										"hover:text-blue-500/70"
																								)}>
																								{
																									item.title
																								}
																							</span>
																							{isActive &&
																								!isCollapsed && (
																									<div className="absolute right-0 w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600" />
																								)}
																						</Link>
																					</SidebarMenuButton>
																				</SidebarMenuItem>
																			)
																		}
																	)}
																</div>
															</div>
														)
													)}
												</div>
											))}
										</div>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</div>

						{/* Footer */}
						<div className="absolute bottom-0 left-0 right-0 bg-background">
							<Separator className="my-2" />
							<SidebarGroup>
								<SidebarGroupContent>
									<SidebarMenu>
										<SidebarMenuItem>
											<TooltipProvider>
												<Tooltip>
													<TooltipTrigger asChild>
														<div className="flex items-center gap-2 py-1.5 data-[state=collapsed]:px-2 data-[state=collapsed]:justify-center">
															<div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
																<img
																	src="https://media.licdn.com/dms/image/v2/C4E0BAQGqRyRh_kmy4Q/company-logo_200_200/company-logo_200_200/0/1630582118391/goparco_logo?e=2147483647&v=beta&t=4oX9T17qzp5O9eOhEeSSygw_HVNM6x_JQwAYn0VC5LE"
																	alt="Parco Logo"
																	className="h-full w-full object-cover"
																/>
															</div>
															<div className="flex flex-col overflow-hidden data-[state=collapsed]:hidden">
																<span className="text-xs text-sidebar-foreground/70">
																	Signed in as
																</span>
																<span className="text-sm font-bold text-gray-500 truncate">
																	ADMIN
																</span>
															</div>
														</div>
													</TooltipTrigger>
													<TooltipContent
														side="right"
														className="data-[state=expanded]:hidden">
														<div className="flex flex-col">
															<span className="text-xs">
																Signed in as
															</span>
															<span className="font-bold">
																ADMIN
															</span>
														</div>
													</TooltipContent>
												</Tooltip>
											</TooltipProvider>
										</SidebarMenuItem>
										<SidebarMenuItem>
											<SidebarMenuButton
												onClick={handleSignOut}
												className="bg-blue-600 hover:bg-blue-700 w-full">
												<LogOut className="h-4 w-4 text-white" />
												{!isCollapsed && (
													<span className="flex-1 text-center text-white">
														Sign out
													</span>
												)}
											</SidebarMenuButton>
										</SidebarMenuItem>
									</SidebarMenu>
								</SidebarGroupContent>
							</SidebarGroup>
						</div>
					</div>
				</SidebarContent>
			</Sidebar>
		</>
	)
}
