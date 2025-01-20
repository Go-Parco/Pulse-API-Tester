"use client"

import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Copy, Search, X, MoreVertical, Download } from "lucide-react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"
import { exampleQueries } from "@/queries/example"
import * as XLSX from "xlsx"

interface TableViewerProps {
	data?: Record<string, string>
	className?: string
	isLoading?: boolean
	keyColumns?: number[]
	options?: {
		responsive?: {
			transposedRowsOnMobile?: boolean
			stickyRowHeader?: boolean
			stickyColumnHeader?: boolean
			stickyColumnHeaderIndex?: number
		}
		styling?: {
			cellPadding?: string
			cellBorder?: string
			cellBorderRadius?: string
			cellBackgroundColor?: string
			hoverBackgroundColor?: string
			hoverTextColor?: string
			cellGap?: string
			cellGapMobile?: string
			roundedTable?: boolean
			zebraStriping?: boolean
			textPosition?: {
				rowHeaders?: "left" | "center" | "right"
				columnHeaders?: "left" | "center" | "right"
				body?: "left" | "center" | "right"
				footer?: "left" | "center" | "right"
				custom?: {
					rows?: Record<number, "left" | "center" | "right">
					columns?: Record<number, "left" | "center" | "right">
					finalRow?: "left" | "center" | "right"
					finalColumn?: "left" | "center" | "right"
				}
			}
			textClasses?: {
				rowHeaders?: string
				columnHeaders?: string
				body?: string
				footer?: string
			}
		}
		filters?: {
			search?: boolean
			searchPlaceholder?: string
			searchDebounce?: number
		}
		buttons?: {
			copyTable?: boolean
			copyColumn?: boolean
			copyColumnIndex?: number
			exportToExcel?: boolean
		}
		pagination?: {
			enabled?: boolean
			maxRows?: number
			showOnMobile?: boolean
		}
	}
}

interface TableRow {
	container: string
	name: string
	value: string
}

const defaultOptions = {
	className: "my-6 flex flex-col !mb-8",
	responsive: {
		transposedRowsOnMobile: true,
		stickyRowHeader: true,
		stickyColumnHeader: true,
		stickyColumnHeaderIndex: 1,
	},
	styling: {
		roundedTable: true,
		cellPadding: "px-4 py-2",
		cellBackgroundColor: "bg-white dark:bg-zinc-950",
		hoverBackgroundColor: "bg-gray-50 dark:bg-gray-900",
		cellGap: "",
		cellBorderRadius: "",
		cellBorder: "border-b border-r border-gray-200 dark:border-gray-800",
		zebraStriping: true,
		textPosition: {
			rowHeaders: "right",
			columnHeaders: "center",
			body: "center",
			footer: "right",
			custom: {
				rows: {} as Record<number, "left" | "center" | "right">,
				columns: {} as Record<number, "left" | "center" | "right">,
			},
		},
		textClasses: {
			rowHeaders: "font-semibold text-lg text-right",
			columnHeaders: "font-semibold text-lg",
			body: "text-sm",
			footer: "text-sm",
		},
	},
	filters: {
		search: false,
		searchPlaceholder: "Search fields...",
		searchDebounce: 300,
	},
	buttons: {
		copyTable: false,
		copyColumn: false,
		copyColumnIndex: 0,
		exportToExcel: false,
	},
	pagination: {
		enabled: true,
		maxRows: 10,
		showOnMobile: false,
	},
} as const

const generateDemoData = () => {
	const data: Record<string, unknown> = {}
	const categories = ["Income", "Tax", "Deduction", "Benefit", "Leave"]
	const types = ["Regular", "Special", "Annual", "Temporary", "Other"]

	for (let i = 1; i <= 70; i++) {
		const category =
			categories[Math.floor(Math.random() * categories.length)]
		const type = types[Math.floor(Math.random() * types.length)]
		const value = (Math.random() * 10000).toFixed(2)
		data[`${category} ${type} ${i}`] = `$${value}`
	}

	return data
}

const defaultData = generateDemoData()

const recordToArray = (data: Record<string, unknown>) => {
	if (!data || Object.keys(data).length === 0) return []
	return Object.entries(data).map(([key, value]) => ({
		field: key,
		value: value,
	}))
}

const getPageNumbers = (currentPage: number, totalPages: number) => {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1)
	}

	if (currentPage <= 3) {
		return [1, 2, 3, 4, "...", totalPages - 1, totalPages]
	}

	if (currentPage >= totalPages - 2) {
		return [
			1,
			2,
			"...",
			totalPages - 3,
			totalPages - 2,
			totalPages - 1,
			totalPages,
		]
	}

	return [
		1,
		"...",
		currentPage - 1,
		currentPage,
		currentPage + 1,
		"...",
		totalPages,
	]
}

const TableViewer = ({
	data = {},
	className = "",
	isLoading = false,
	keyColumns = [0, 1],
	options: customOptions = {},
}: TableViewerProps) => {
	const { toast } = useToast()
	const [currentPage, setCurrentPage] = useState(1)
	const [searchTerm, setSearchTerm] = useState("")
	const debouncedSearch = useDebounce(
		searchTerm,
		customOptions.filters?.searchDebounce || 300
	)

	// Convert exampleQueries to our table format
	const allRows = exampleQueries.map((query) => ({
		container: query.Container || "",
		name: query.Name || "",
		value: data[query.Name as string] || "",
	}))

	// Filter rows based on search
	const filteredRows = allRows.filter((row) => {
		if (!debouncedSearch) return true
		const searchLower = debouncedSearch.toLowerCase()
		return (
			String(row.container).toLowerCase().includes(searchLower) ||
			String(row.name).toLowerCase().includes(searchLower) ||
			String(row.value).toLowerCase().includes(searchLower)
		)
	})

	const shouldPaginate =
		customOptions.pagination?.enabled &&
		filteredRows.length > (customOptions.pagination?.maxRows || 10) &&
		(!customOptions.responsive?.transposedRowsOnMobile ||
			window.innerWidth > 768)

	const itemsPerPage = customOptions.pagination?.maxRows || 10
	const totalPages = Math.ceil(filteredRows.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const rows = shouldPaginate
		? filteredRows.slice(startIndex, endIndex)
		: filteredRows

	// Reset to first page when search changes
	useEffect(() => {
		setCurrentPage(1)
	}, [debouncedSearch])

	const options = {
		...defaultOptions,
		...customOptions,
		styling: {
			...defaultOptions.styling,
			...customOptions?.styling,
			textPosition: {
				...defaultOptions.styling.textPosition,
				...customOptions?.styling?.textPosition,
				custom: {
					...defaultOptions.styling.textPosition.custom,
					...customOptions?.styling?.textPosition?.custom,
				},
			},
		},
	}

	// Style objects
	const tableStyles = {
		wrapper: cn(
			"relative w-full overflow-hidden",
			options.styling?.roundedTable ? "rounded-lg border" : "border",
			className
		),
		table: cn(
			"w-full",
			options.styling?.cellGap ? "border-separate" : "border-collapse"
		),
		headerCell: (index: number) =>
			cn(
				options.styling?.cellPadding || "px-4 py-2",
				options.styling?.cellBorder ||
					"border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0",
				"bg-zinc-50 dark:bg-zinc-900",
				"text-gray-900 dark:text-gray-100",
				options.responsive?.stickyColumnHeader && "sticky top-0 z-10",
				options.styling?.textPosition?.columnHeaders &&
					`text-${options.styling.textPosition.columnHeaders}`,
				options.styling?.textClasses?.columnHeaders
			),
		cell: (index: number) =>
			cn(
				options.styling?.cellPadding || "px-4 py-2",
				options.styling?.cellBorder ||
					"border-b border-r border-gray-200 dark:border-gray-800 last:border-r-0",
				"max-w-[200px] overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600",
				options.styling?.zebraStriping
					? "bg-transparent"
					: "bg-white dark:bg-zinc-950",
				"text-gray-900 dark:text-gray-100",
				options.styling?.cellBorderRadius,
				"transition-colors",
				"group-hover:bg-gray-50 dark:group-hover:bg-gray-800",
				options.styling?.textPosition?.body &&
					`text-${options.styling.textPosition.body}`,
				options.styling?.textClasses?.body,
				options.styling?.textPosition?.custom?.columns?.[index],
				options.styling?.textPosition?.custom?.finalColumn &&
					index === 1 &&
					`text-${options.styling.textPosition.custom.finalColumn}`
			),
		row: (index: number, isLastRow: boolean) =>
			cn(
				"group transition-colors",
				isLastRow ? "border-b-0" : "border-b",
				options.styling?.zebraStriping &&
					index % 2 === 1 &&
					"bg-gray-50/50 dark:bg-zinc-900/50",
				"hover:bg-gray-50 dark:hover:bg-gray-800",
				"[&>td]:group-hover:bg-gray-50 dark:[&>td]:group-hover:bg-gray-800",
				options.styling?.textPosition?.custom?.rows?.[index] &&
					`text-${options.styling.textPosition.custom.rows[index]}`,
				isLastRow &&
					options.styling?.textPosition?.custom?.finalRow &&
					`text-${options.styling.textPosition.custom.finalRow}`
			),
		mobileCard: cn(
			"block md:hidden mb-4 rounded-lg border border-gray-200 dark:border-gray-800",
			"bg-white dark:bg-zinc-950 relative",
			"hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors",
			"shadow-sm hover:shadow-md transition-shadow",
			"grid grid-cols-[140px,1fr]"
		),
		mobileCardHeaders: cn(
			"col-span-2 grid grid-cols-subgrid px-4 pt-4",
			"border-b border-gray-200 dark:border-gray-800",
			"pb-2"
		),
		mobileCardContent: cn("contents"),
		mobileCardLeft: cn(
			"bg-gray-50 dark:bg-gray-900",
			"border-r border-gray-200 dark:border-gray-800",
			"grid content-start gap-y-2 px-4 py-4"
		),
		mobileCardRight: cn("grid content-start gap-y-2 px-4 py-4"),
		mobileCardHeader: cn(
			"text-sm font-semibold text-gray-500 dark:text-gray-400",
			"text-center"
		),
		mobileCardItem: cn("min-h-[24px] max-h-[192px]", "flex items-center"),
		mobileCardLabel: cn(
			"text-base font-medium text-gray-500 dark:text-gray-400",
			"text-center"
		),
		mobileCardValue: cn(
			"text-base font-semibold break-words",
			"text-gray-900 dark:text-gray-100 text-center"
		),
		mobileCardIndex: cn(
			"absolute top-2 right-2 w-7 h-7 flex items-center justify-center",
			"rounded-full bg-gray-100 dark:bg-gray-800",
			"text-sm font-medium text-gray-600 dark:text-gray-400"
		),
	}

	const handleCopyTable = async (entireTable = false) => {
		try {
			const rowsToCopy = entireTable ? allRows : rows
			const text = rowsToCopy
				.map((row) => `${row.container}: ${row.name}: ${row.value}`)
				.join("\n")
			if (rowsToCopy.length === 0) {
				toast({
					title: "No data to copy",
					description: "There is no data to copy",
					variant: "destructive",
				})
				return
			}
			await navigator.clipboard.writeText(text)
			toast({
				title: "Table Copied Successfully",
				description: `${rowsToCopy.length} rows copied to clipboard`,
				variant: "default",
			})
		} catch (err) {
			toast({
				title: "Failed to Copy Table",
				description:
					"Please try again or contact support if the issue persists",
				variant: "destructive",
			})
		}
	}

	const handleCopyColumn = async (entireColumn = false) => {
		try {
			const rowsToCopy = entireColumn ? allRows : rows
			const columnIndex = customOptions?.buttons?.copyColumnIndex || 0
			const text = rowsToCopy
				.map((row) =>
					String(columnIndex === 0 ? row.container : row.value)
				)
				.join("\n")
			if (rowsToCopy.length === 0) {
				toast({
					title: "No data to copy",
					description: "There is no data to copy",
					variant: "destructive",
				})
				return
			}
			await navigator.clipboard.writeText(text)
			toast({
				title: "Column Copied Successfully",
				description: `Column ${columnIndex + 1} (${
					rowsToCopy.length
				} values) copied to clipboard`,
			})
		} catch (err) {
			toast({
				title: "Failed to Copy Column",
				description:
					"Please try again or contact support if the issue persists",
				variant: "destructive",
			})
		}
	}

	const getRowKey = (row: TableRow) => {
		const values = keyColumns.map((index) => {
			switch (index) {
				case 0:
					return row.container
				case 1:
					return row.name
				case 2:
					return row.value
				default:
					return ""
			}
		})
		return values.join(".")
	}

	const handleExcelDownload = (format: "csv" | "xlsx") => {
		const headers = ["Container", "Name", "Value"]
		const rows = allRows.map((row) => [row.container, row.name, row.value])

		if (format === "csv") {
			const csvContent = [
				headers.join(","),
				...rows.map((row) =>
					row
						.map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
						.join(",")
				),
			].join("\n")

			const blob = new Blob([csvContent], {
				type: "text/csv;charset=utf-8;",
			})
			const url = URL.createObjectURL(blob)
			const link = document.createElement("a")
			link.setAttribute("href", url)
			link.setAttribute("download", "table-data.csv")
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
		} else {
			const wb = XLSX.utils.book_new()
			const ws = XLSX.utils.aoa_to_sheet([headers, ...rows])
			XLSX.utils.book_append_sheet(wb, ws, "Data")
			XLSX.writeFile(wb, "table-data.xlsx")
		}
	}

	return (
		<div className={cn("space-y-4 max-w-screen-md mx-auto", className)}>
			<div className="space-y-4 lg:space-y-0 lg:flex lg:justify-between lg:items-center">
				{customOptions.filters?.search && (
					<div className="w-full lg:max-w-md">
						<div className="relative">
							<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder={
									customOptions.filters.searchPlaceholder ||
									"Search fields..."
								}
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className={cn(
									"pl-8",
									searchTerm.length > 0 && "pr-8"
								)}
								disabled={isLoading}
							/>
							{searchTerm.length > 0 && (
								<button
									onClick={() => setSearchTerm("")}
									className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
									aria-label="Clear search">
									<X className="h-4 w-4" />
								</button>
							)}
						</div>
					</div>
				)}
				{(customOptions.buttons?.copyTable ||
					customOptions.buttons?.copyColumn) && (
					<div className="flex flex-wrap gap-2 justify-end">
						{customOptions.buttons?.copyTable && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2">
										<Copy className="h-4 w-4" />
										Copy Table
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => handleCopyTable(false)}>
										Copy Current Page
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleCopyTable(true)}>
										Copy Entire Table
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						{customOptions.buttons?.copyColumn && (
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										className="flex items-center gap-2">
										<Copy className="h-4 w-4" />
										Copy Column{" "}
										{(customOptions.buttons
											?.copyColumnIndex ?? 0) + 1}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem
										onClick={() => handleCopyColumn(false)}>
										Copy Visible Column{" "}
										{(customOptions?.buttons
											?.copyColumnIndex ?? 0) + 1}{" "}
										({rows.length} values)
									</DropdownMenuItem>
									<DropdownMenuItem
										onClick={() => handleCopyColumn(true)}>
										Copy Entire Column{" "}
										{(customOptions?.buttons
											?.copyColumnIndex ?? 0) + 1}{" "}
										({allRows.length} values)
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						)}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="px-2"
									disabled={isLoading}>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem
									onClick={() => handleExcelDownload("xlsx")}>
									<Download className="h-4 w-4 mr-2" />
									Download Excel (.xlsx)
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => handleExcelDownload("csv")}>
									<Download className="h-4 w-4 mr-2" />
									Download CSV
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				)}
			</div>
			<div className="hidden md:block">
				<div className={tableStyles.wrapper}>
					<Table className={tableStyles.table}>
						<TableHeader>
							<TableRow>
								<TableHead
									className={tableStyles.headerCell(0)}>
									Container
								</TableHead>
								<TableHead
									className={tableStyles.headerCell(1)}>
									Name
								</TableHead>
								<TableHead
									className={tableStyles.headerCell(2)}>
									Value
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{isLoading ? (
								<TableRow>
									<TableCell colSpan={3} className="h-24">
										<div className="flex items-center justify-center">
											<div className="animate-pulse flex space-x-4 items-center text-muted-foreground">
												<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
												<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
												<div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
												<span className="ml-2">
													Loading data...
												</span>
											</div>
										</div>
									</TableCell>
								</TableRow>
							) : rows.length > 0 ? (
								rows.map((row, index) => (
									<TableRow
										key={getRowKey(row)}
										className={tableStyles.row(
											index,
											index === rows.length - 1
										)}>
										<TableCell
											className={tableStyles.cell(0)}>
											{row.container}
										</TableCell>
										<TableCell
											className={tableStyles.cell(1)}>
											{row.name}
										</TableCell>
										<TableCell
											className={tableStyles.cell(2)}>
											{row.value}
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={3}
										className="h-24 text-center">
										No data
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>
			<div className="md:hidden space-y-4">
				{isLoading ? (
					<div className={tableStyles.mobileCard}>
						<div className="flex items-center justify-center h-24">
							<div className="animate-pulse flex space-x-4 items-center text-muted-foreground">
								<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
								<div className="h-2 w-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
								<div className="h-2 w-2 bg-current rounded-full animate-bounce"></div>
								<span className="ml-2">Loading data...</span>
							</div>
						</div>
					</div>
				) : rows.length > 0 ? (
					rows.map((row, index) => (
						<div
							key={getRowKey(row)}
							className={tableStyles.mobileCard}>
							<div className={tableStyles.mobileCardHeaders}>
								<div className={tableStyles.mobileCardHeader}>
									KEY
								</div>
								<div className={tableStyles.mobileCardHeader}>
									VALUE
								</div>
							</div>
							<div className={tableStyles.mobileCardLeft}>
								{["Container", "Name", "Value"].map((label) => (
									<div
										key={label}
										className={tableStyles.mobileCardItem}>
										<span
											className={
												tableStyles.mobileCardLabel
											}>
											{label}
										</span>
									</div>
								))}
							</div>
							<div className={tableStyles.mobileCardRight}>
								{["Container", "Name", "Value"].map(
									(value, i) => (
										<div
											key={i}
											className={
												tableStyles.mobileCardItem
											}>
											<span
												className={
													tableStyles.mobileCardValue
												}>
												{value}
											</span>
										</div>
									)
								)}
							</div>
							<span className={tableStyles.mobileCardIndex}>
								{startIndex + index + 1}
							</span>
						</div>
					))
				) : (
					<div className={tableStyles.mobileCard}>
						<div className="text-center py-8 text-gray-500">
							No data
						</div>
					</div>
				)}
			</div>
			{shouldPaginate && totalPages > 1 && (
				<Pagination>
					<PaginationContent
						className={
							isLoading ? "pointer-events-none opacity-50" : ""
						}>
						<PaginationItem>
							<PaginationPrevious
								onClick={() =>
									setCurrentPage((p) => Math.max(1, p - 1))
								}
								className={cn(
									"cursor-pointer",
									currentPage === 1 &&
										"pointer-events-none opacity-50"
								)}
							/>
						</PaginationItem>

						{getPageNumbers(currentPage, totalPages).map(
							(pageNum, i) => (
								<PaginationItem key={i}>
									{pageNum === "..." ? (
										<PaginationEllipsis />
									) : (
										<PaginationLink
											onClick={() =>
												setCurrentPage(
													pageNum as number
												)
											}
											isActive={currentPage === pageNum}
											className="cursor-pointer">
											{pageNum}
										</PaginationLink>
									)}
								</PaginationItem>
							)
						)}

						<PaginationItem>
							<PaginationNext
								onClick={() =>
									setCurrentPage((p) =>
										Math.min(totalPages, p + 1)
									)
								}
								className={cn(
									"cursor-pointer",
									currentPage === totalPages &&
										"pointer-events-none opacity-50"
								)}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}

export default TableViewer
