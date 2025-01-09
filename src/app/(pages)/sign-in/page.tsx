import React, { useState } from "react"
import { useRouter } from "next/router"

export default function SignIn() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [error, setError] = useState<string | null>(null)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const response = await fetch("/api/auth/signin", {
				method: "POST",
				body: JSON.stringify({ email, password }),
				headers: {
					"Content-Type": "application/json",
				},
			})

			if (!response.ok) {
				const data = await response.json()
				throw new Error(data.error || "Failed to sign in")
			}

			router.push("/") // Redirect to home page after successful sign in
		} catch (err: any) {
			setError(err.message)
		}
	}

	return (
		<div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
						Parco Pulse OCR
					</h2>
					<p className="mt-2 text-sm text-center text-gray-600">
						Admin access to Pulse OCR testing page
					</p>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<div className="flex flex-col gap-2 -space-y-px rounded-md shadow-sm">
						<div>
							<label htmlFor="email" className="sr-only">
								Email address
							</label>
							<input
								id="email"
								name="email"
								type="email"
								autoComplete="email"
								required
								className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Email address"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
								placeholder="Password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{error && (
						<div className="text-sm text-center text-red-500">
							{error}
						</div>
					)}

					<div>
						<button
							type="submit"
							className="relative flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md group hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
							Sign in
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
