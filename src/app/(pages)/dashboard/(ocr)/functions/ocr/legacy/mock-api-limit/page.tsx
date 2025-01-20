import React from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import MockAPI from "./mock_api"

const MockApiLimit = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-3xl">Mock OCR API Call</CardTitle>
				<CardDescription className="w-4/5 text-center justify-middle flex mx-auto">
					This section was built to unify multiple API calls to await
					the response each time (a requirement for 15+ queries
					through Textract), to promise.all the responses and to
					populate a unified response as if the API was called once.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<MockAPI />
			</CardContent>
		</Card>
	)
}

export default MockApiLimit
