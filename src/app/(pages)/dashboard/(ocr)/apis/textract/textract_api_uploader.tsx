"use client"
import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form"
import FileUploader from "@/components/myComponents/fileUploader"
import { AcceptedFileType, Agency } from "@/types/FileTypes"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import TableViewer from "@/components/myComponents/tableViewer"
import { AgencyForm } from "../../api_pages/textract/AgencyForm"
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select"
import { agencyOptions } from "@/types/zodQuerySchemaMaster"
import { testAgencyQueries as getAgencyQueries } from "../../api_pages/textract/testAgencyQueries"

const formSchema = z.object({
	agency: z.string({
		required_error: "Please select an agency",
	}),
	file:
		typeof window === "undefined"
			? z.any()
			: z
					.instanceof(FileList)
					.nullable()
					.refine(
						(files) => files && files.length > 0,
						"File is required."
					)
					.refine(
						(files) =>
							files &&
							(files[0].type.startsWith("image/") ||
								files[0].type === "application/pdf"),
						"File must be an image or PDF."
					)
					.refine(
						(files) => files && files[0].size <= 5000000,
						"File size must be less than 5MB."
					),
})

const TextractUploader = () => {
	const [loadingState, setLoadingState] = useState<
		"idle" | "loading" | "processing" | "populating form" | "completed"
	>("idle")
	const [showAgencySelect, setShowAgencySelect] = useState(false)
	const [preview, setPreview] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [formData, setFormData] = useState<any>(null)
	const { toast } = useToast()
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	const onSubmit = async (data: z.infer<typeof formSchema>) => {
		// Your existing onSubmit logic
	}

	const handleFormSubmit = (data: any) => {
		console.log("Form submitted with data:", data)
	}

	const getStatusMessage = () => {
		switch (loadingState) {
			case "loading":
				return (
					<div className="flex items-center gap-2 text-blue-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Loading document...</span>
					</div>
				)
			case "processing":
				return (
					<div className="flex items-center gap-2 text-amber-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>
							Processing{" "}
							{form.getValues("file")?.[0]?.type ===
							"application/pdf"
								? "PDF"
								: "image"}
							...
						</span>
					</div>
				)
			case "populating form":
				return (
					<div className="flex items-center gap-2 text-amber-600">
						<Loader2 className="h-4 w-4 animate-spin" />
						<span>Populating form...</span>
					</div>
				)
			case "completed":
				return (
					<div className="flex items-center gap-2 text-green-600">
						<svg
							className="h-4 w-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M5 13l4 4L19 7"
							/>
						</svg>
						<span>Data processed successfully!</span>
					</div>
				)
			default:
				return null
		}
	}

	// ... rest of your component
}

export default TextractUploader
