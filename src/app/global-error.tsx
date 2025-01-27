"use client"

import { useEffect } from "react"
import { SafeLog } from "@/utils/SafeLog"

export default function GlobalError({
	error,
	reset,
}: {
	error: Error & { digest?: string }
	reset: () => void
}) {
	useEffect(() => {
		SafeLog({ display: false, log: { "Global error": error } })
	}, [error])

	return (
		<html lang="en">
			<body>
				<div className="min-h-screen flex items-center justify-center bg-gray-100">
					<div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
						<h2 className="text-2xl font-bold text-red-600 mb-4">
							Something went wrong!
						</h2>
						<p className="text-gray-600 mb-4">
							{error.message || "An unexpected error occurred"}
						</p>
						<button
							onClick={() => reset()}
							className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
							Try again
						</button>
					</div>
				</div>
			</body>
		</html>
	)
}
