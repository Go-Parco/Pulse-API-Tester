import React from "react"
import Image from "next/image"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import TextractUploader from "../textract_api_uploader"
import textractLogo from "@/assets/icons/textract.png"

const FormTableOutput = () => {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-3xl flex gap-4">
					<Image
						className="rounded-xl shadow-sm aspect-square object-cover"
						src={textractLogo}
						alt="Textract Logo"
						width={32}
						height={32}
					/>
					Textract API Uploader Auto-Fill Form
				</CardTitle>
				<CardDescription className="w-4/5 text-center justify-middle flex mx-auto">
					Upload a document to have it processed through textract and
					see the results populated below.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<TextractUploader />
			</CardContent>
		</Card>
	)
}

export default FormTableOutput
