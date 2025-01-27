"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SafeLog } from "@/utils/SafeLog"

export default function DashboardError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		SafeLog({ display: false, log: { "Dashboard error": error } })
	}, [error])

	return (
		<div className="min-h-[50vh] flex items-center justify-center">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h2 className="text-2xl font-bold text-red-600 mb-4">
					Dashboard Error
				</h2>
				<p className="text-gray-600 mb-4">
					{error.message ||
						"An error occurred while loading the dashboard"}
				</p>
				<div className="flex gap-4">
					<Button onClick={() => reset()} variant="default">
						Try again
					</Button>
					<Button
						onClick={() => window.location.reload()}
						variant="outline">
						Reload page
					</Button>
				</div>
			</div>
		</div>
	)
}
