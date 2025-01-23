import React from "react"

export default function DashboardLoading(): React.ReactElement {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="text-center">
				<div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
				<p className="text-gray-600">Loading dashboard...</p>
			</div>
		</div>
	)
}
