"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function RootError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		console.error(error)
	}, [error])

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
				<h2 className="text-2xl font-bold text-red-600 mb-4">
					Something went wrong!
				</h2>
				<p className="text-gray-600 mb-4">
					{error.message || "An unexpected error occurred"}
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
