import React from "react"
import { QueryConverter } from "@/functions/queryConverter"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"

const queries = [
	{
		marker: "DEDUCTIONS > TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > ITEM > TSP SAVINGS",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > ITEM > TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "TSP SAVINGS x CURRENT",
		verified: true,
	},
	{
		marker: "DEDUCTIONS > TSP SAVINGS",
		verified: true,
	},
	{
		marker: "PAY PERIOD",
		verified: true,
	},
]

const QueryConversion = () => {
	return (
		<main className="flex flex-col gap-8 mb-24 row-start-2 items-center sm:items-start">
			<Card className="!rounded-xl">
				<CardHeader>
					<CardTitle>Query Conversion</CardTitle>
					<CardDescription>
						Shows the query Conversion to work amoungst multiple
						different Marker queries. (also used for testing)
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="">Marker</TableHead>
								<TableHead>Converted Text</TableHead>
								<TableHead className="text-right">
									Valid
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{queries.map((query) => (
								<TableRow key={query.marker}>
									<TableCell className="font-medium">
										{query.marker}
									</TableCell>
									<TableCell>
										{QueryConverter(query.marker)}
									</TableCell>
									<TableCell className="text-right">
										{query.verified ? (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-green-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M5 13l4 4L19 7"
												/>
											</svg>
										) : (
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-6 w-6 text-red-500"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M6 18L18 6M6 6l12 12"
												/>
											</svg>
										)}
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</main>
	)
}

export default QueryConversion
