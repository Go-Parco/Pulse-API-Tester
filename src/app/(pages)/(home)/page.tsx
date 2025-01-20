"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
	const router = useRouter()

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
			<div className="max-w-3xl w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
				<div className="space-y-4">
					<img
						src="https://media.licdn.com/dms/image/v2/C4E0BAQGqRyRh_kmy4Q/company-logo_200_200/company-logo_200_200/0/1630582118391/goparco_logo?e=2147483647&v=beta&t=4oX9T17qzp5O9eOhEeSSygw_HVNM6x_JQwAYn0VC5LE"
						alt="Parco Logo"
						className="h-16 w-16 mx-auto rounded-full"
					/>
					<h1 className="text-4xl font-bold text-gray-900">
						Parco API / Function Test Demo
					</h1>
					<p className="text-xl text-gray-600">
						Test / Demo our API and functions.
					</p>
				</div>
				<div className="space-y-4">
					<p className="text-gray-500 text-balance max-w-md mx-auto">
						Please sign in to access the API dashboard and start
						exploring our services. See Admin for login information.
					</p>
					<div className="flex flex-col items-center gap-2">
						<Button
							onClick={() => router.push("/sign-in")}
							className="w-full max-w-sm">
							Sign In
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
