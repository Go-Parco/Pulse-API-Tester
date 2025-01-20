import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import {
	LightningBoltIcon,
	QuestionMarkCircledIcon,
} from "@radix-ui/react-icons"
import { exampleQueries } from "@/queries/example"
import { Query, QueryWithNames } from "@/types"
import { cn } from "@/lib/utils"
import Confetti from "react-confetti"

interface AgencyFormProps {
	onSubmit: (data: any) => void
	defaultValues?: Partial<any>
	selectedAgency?: string
	queries: any[]
}

// Move schema creation outside component
const createFormSchema = (fields: Array<{ name: string }>) => {
	const schemaObj: Record<string, z.ZodString> = {}
	fields.forEach((field) => {
		switch (field.name.toLowerCase()) {
			case "fegli.basic":
			case "fegli.optional":
			case "fegli.coverage":
				schemaObj[field.name] = z
					.string()
					.trim()
					.regex(
						/^\$?[\d,]+(\.\d{2})?$/,
						"Must be a dollar amount (e.g. $278.43 or 278.43)"
					)
					.min(1, "FEGLI amount is required")
				break
			case "tsp.contribution":
				schemaObj[field.name] = z
					.string()
					.trim()
					.regex(
						/^\$?[\d,]+(\.\d{2})?$/,
						"Must be a dollar amount (e.g. $566.90 or 566.90)"
					)
					.min(1, "TSP contribution amount is required")
				break
			default:
				schemaObj[field.name] = z
					.string()
					.trim()
					.min(1, "This field is required")
		}
	})
	return z.object(schemaObj)
}

export function AgencyForm({
	onSubmit,
	defaultValues,
	selectedAgency = "",
	queries,
}: AgencyFormProps) {
	// Generate form fields based on example.ts, making keys unique with container
	const formFields = exampleQueries
		.filter((query): query is QueryWithNames => "Name" in query)
		.map((query) => ({
			id: `${query.Container}.${query.Name}`,
			name: query.Name,
			label: query.Name.split(".")
				.map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
				.join(" "),
			container: query.Container,
			hasAgencyQuery: queries.some(
				(q): q is QueryWithNames =>
					"Name" in q &&
					q.Name === query.Name &&
					q.Container === query.Container
			),
		}))

	// Remove duplicates based on the unique id
	const uniqueFormFields = formFields.filter(
		(field, index, self) =>
			index === self.findIndex((f) => f.id === field.id)
	)

	const formSchema = createFormSchema(uniqueFormFields)
	type FormData = z.infer<typeof formSchema>

	const form = useForm<FormData>({
		// resolver: zodResolver(formSchema),
		defaultValues: {},
		mode: "onChange",
	})

	useEffect(() => {
		if (defaultValues) {
			form.reset({})

			Object.entries(defaultValues).forEach(([key, value]) => {
				form.setValue(key, value?.toString().trim() ?? "", {
					shouldValidate: true,
					shouldDirty: true,
				})
			})
		}
	}, [defaultValues, form])

	const [showAllFields, setShowAllFields] = useState(false)
	const [showConfetti, setShowConfetti] = useState(false)
	const [showModal, setShowModal] = useState(false)

	// Sort fields into verified and unverified
	const sortedFields = uniqueFormFields.sort((a, b) => {
		if (a.hasAgencyQuery && !b.hasAgencyQuery) return -1
		if (!a.hasAgencyQuery && b.hasAgencyQuery) return 1
		return 0
	})

	const verifiedFields = sortedFields.filter((field) => field.hasAgencyQuery)
	const unverifiedFields = sortedFields
		.filter((field) => !field.hasAgencyQuery)
		.sort((a, b) => {
			// Get the form values for comparison
			const valueA = form.getValues(a.name)
			const valueB = form.getValues(b.name)

			// Sort populated fields first
			if (valueA && !valueB) return -1
			if (!valueA && valueB) return 1
			return 0
		})

	// get reset function from react-hook-form
	const { reset } = form

	const handleSubmit = async (data: FormData) => {
		onSubmit(data)
		// setShowConfetti(true)
		// scroll to the top of the page
		window.scrollTo(0, 0)
		// setShowModal(true)
		setTimeout(() => setShowConfetti(false), 5000)
		reset()
	}

	return (
		<>
			{showConfetti && <Confetti />}
			<div className="bg-zinc-50 mt-8 w-full h-fit p-6 rounded-lg shadow-sm border border-zinc-200">
				<h2 className="text-2xl font-bold text-zinc-900">
					Agency Form {selectedAgency && `- ${selectedAgency}`}
				</h2>
				<p className="text-sm text-zinc-500 mb-8">
					Form fields with ⚡️ indicate values expected from the
					document analysis.
				</p>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6">
						<div className="flex flex-col gap-6">
							{/* Verified fields always shown */}
							{verifiedFields.map((field) => (
								<FormField
									key={field.id}
									control={form.control}
									name={field.name}
									render={({ field: formField }) => (
										<FormItem className="flex flex-col gap-2">
											<div className="flex items-center gap-2 relative">
												<div className="flex-grow">
													<FormLabel className="text-lg font-semibold">
														{field.label}
													</FormLabel>
													<FormControl>
														<Input
															{...formField}
															className={cn(
																"bg-white",
																form.formState
																	.errors[
																	field.name
																] &&
																	"border-red-500 focus-visible:ring-red-500"
															)}
														/>
													</FormControl>
												</div>
												{field.hasAgencyQuery && (
													<div className="flex flex-col h-fit my-auto">
														<p className="text-lg !text-transparent">
															...
														</p>
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger>
																	<LightningBoltIcon className="h-4 w-4 text-yellow-500" />
																</TooltipTrigger>
																<TooltipContent>
																	<p>
																		This
																		value is
																		expected
																		to be
																		extracted
																		from the
																		document
																	</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													</div>
												)}
											</div>
											<FormMessage />
										</FormItem>
									)}
								/>
							))}

							{/* Unverified fields shown conditionally */}
							{unverifiedFields.length > 0 && (
								<>
									<Button
										type="button"
										variant="outline"
										onClick={() =>
											setShowAllFields(!showAllFields)
										}
										className="w-full mt-4">
										{showAllFields ? "Hide" : "View"}{" "}
										additional data questions (
										{unverifiedFields.length})
									</Button>

									<p className="text-zinc-400">
										Input the following values in manually
										if desired
									</p>
									{showAllFields && (
										<div className="space-y-4 mt-4 border-t pt-4">
											{unverifiedFields.map((field) => (
												<FormField
													key={field.id}
													control={form.control}
													name={field.name}
													render={({
														field: formField,
													}) => (
														<FormItem className="flex items-center gap-2">
															<div className="flex-grow">
																<FormLabel>
																	{
																		field.label
																	}
																</FormLabel>
																<FormControl>
																	<Input
																		{...formField}
																		className="bg-white"
																	/>
																</FormControl>
															</div>
															{field.hasAgencyQuery && (
																<TooltipProvider>
																	<Tooltip>
																		<TooltipTrigger>
																			<LightningBoltIcon className="h-4 w-4 text-yellow-500" />
																		</TooltipTrigger>
																		<TooltipContent>
																			<p>
																				This
																				value
																				is
																				expected
																				to
																				be
																				extracted
																				from
																				the
																				document
																			</p>
																		</TooltipContent>
																	</Tooltip>
																</TooltipProvider>
															)}
														</FormItem>
													)}
												/>
											))}
										</div>
									)}
								</>
							)}
						</div>
						<Button
							type="submit"
							className="w-full mt-8 !bg-gradient-to-br !from-teal-400 !to-sky-500 hover:!bg-gradient-to-br hover:!from-teal-500 hover:!to-sky-600 ease-in duration-300 transition-all text-white text-xl">
							Save Changes
						</Button>
					</form>
				</Form>
			</div>
		</>
	)
}
