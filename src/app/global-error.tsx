"use client"

import React, { useEffect } from "react"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export default function GlobalError({
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
		<html lang="en">
			<body className={inter.className}>
				<main className="flex min-h-screen flex-col items-center justify-center p-4">
					<div className="text-center">
						<h2 className="text-2xl font-bold mb-4">
							Something went wrong!
						</h2>
						<p className="text-gray-600 mb-4">
							{error.message || "An unexpected error occurred"}
						</p>
						<button
							onClick={reset}
							className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
							Try again
						</button>
					</div>
				</main>
			</body>
		</html>
	)
}
