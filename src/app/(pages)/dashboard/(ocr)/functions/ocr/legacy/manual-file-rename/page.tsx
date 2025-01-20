"use client"
import React, { useState } from "react"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import FileRenameHeader from "./fileRenameHeader"
import { useToast } from "@/hooks/use-toast"
import Dropzone from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { FileDocRenameType, AccountType } from "@/types/FileTypes"

const ManualFileRename = () => {
	const [fileName, setFileName] = useState<FileDocRenameType>({
		documentType: "voidedCheck",
		accountStatement: "edward jones",
	})
	const [fileDownloadReady, setFileDownloadReady] = useState(false)
	const [uploadedFile, setUploadedFile] = useState<File | null>(null)
	const [imagePreviews, setImagePreviews] = useState<string[]>([])
	const { toast } = useToast()

	const onDrop = (acceptedFiles: File[]) => {
		const previews = acceptedFiles.map((file) => URL.createObjectURL(file))
		setImagePreviews(previews)
	}

	const handleFileNameChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		type: keyof FileDocRenameType
	) => {
		setFileName({ ...fileName, [type]: e.target.value })
	}

	const handleFileUpload = (acceptedFiles: File[]) => {
		if (acceptedFiles && acceptedFiles[0]) {
			setUploadedFile(acceptedFiles[0])
			setFileDownloadReady(true)
			toast({
				title: "Uploaded File",
			})
		}
	}

	const handleDownload = () => {
		if (uploadedFile) {
			const url = URL.createObjectURL(uploadedFile)
			const a = document.createElement("a")
			a.href = url
			a.download = `${fileName.documentType}_${
				fileName.accountStatement
			}.${uploadedFile.name.split(".").pop()}`
			document.body.appendChild(a)
			a.click()
			document.body.removeChild(a)
			URL.revokeObjectURL(url)
			setFileDownloadReady(false)
			setUploadedFile(null)
			setImagePreviews([])
			toast({
				title: "Downloaded File",
			})
		} else {
			console.log("No file uploaded")
		}
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>Manual File Rename Example</CardTitle>
				<CardDescription>
					Rename the File Name below and select the Account Statement
					type from the dropdown.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-2">
				<FileRenameHeader />
				<div className="flex flex-col text-sm text-gray-500 dark:text-gray-400">
					<form
						className="flex flex-col gap-2 py-4"
						onSubmit={(e) => {
							e.preventDefault()
							setFileDownloadReady(true)
						}}>
						{/* File upload */}
						<Dropzone
							onDrop={(acceptedFiles) => {
								handleFileUpload(acceptedFiles)
								onDrop(acceptedFiles)
							}}>
							{({ getRootProps, getInputProps }) => (
								<section
									className={`min-h-[150px] flex flex-col items-center align-middle justify-center my-8 rounded-lg border-dashed border-zinc-200 hover:border-zinc-400 p-5 border-2 ease-in-out duration-300 transition-all`}>
									{/* Delete icon button */}
									{uploadedFile && (
										<div className="flex justify-end w-full">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												onClick={() => {
													setUploadedFile(null)
													setImagePreviews([])
												}}
												className="h-6 w-6 cursor-pointer hover:text-black"
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
										</div>
									)}
									<div
										{...getRootProps()}
										className="flex flex-col items-center">
										<input {...getInputProps()} />
										<div className="inset-0 h-fit w-fit">
											<p className="cursor-pointer text-center">
												{uploadedFile ? (
													<>
														{uploadedFile.name} -{" "}
														{uploadedFile.size}{" "}
														bytes
													</>
												) : (
													"Drag 'n' drop some files here, or click to select files"
												)}
											</p>
										</div>
									</div>
									{imagePreviews.length > 0 && (
										<div className="flex flex-wrap mt-4">
											{imagePreviews.map(
												(preview, index) => (
													<img
														key={index}
														src={preview}
														alt={`Preview ${index}`}
														className="max-h-[250px] w-auto h-auto object-contain m-2"
														style={{
															maxWidth: "100%",
														}}
													/>
												)
											)}
										</div>
									)}
								</section>
							)}
						</Dropzone>
						<div className="flex flex-col gap-4">
							<Label
								htmlFor="file-name"
								className="text-black px-2">
								File Name:
							</Label>
							<Input
								id="file-name"
								type="text"
								className="border-gray-200 border text-zinc-800 py-3 px-4 rounded-md"
								value={fileName.documentType}
								onChange={(e) =>
									handleFileNameChange(e, "documentType")
								}
							/>
							{/* Account Statement */}
							<SelectGroup>
								<SelectLabel className="text-black">
									Account Statement
								</SelectLabel>
								<Select
									onValueChange={(e) => {
										setFileName({
											...fileName,
											accountStatement: e as AccountType,
										})
									}}>
									<SelectTrigger
										className=""
										id="account-statement">
										<SelectValue placeholder="Select" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="edward jones">
											Edward Jones
										</SelectItem>
										<SelectItem value="ameritrade">
											Ameritrade
										</SelectItem>
										<SelectItem value="carol swhab">
											Carol Swhab
										</SelectItem>
									</SelectContent>
								</Select>
							</SelectGroup>
						</div>
						<div className="flex flex-col gap-4 my-8">
							{uploadedFile && (
								<p className="px-2 text-sky-700">
									File will be renamed to: "
									{fileName.documentType}_
									{fileName.accountStatement}.
									{uploadedFile?.name.split(".").pop()}"
								</p>
							)}
							<Button
								type="submit"
								disabled={fileDownloadReady || !uploadedFile}
								className="text-white disabled:opacity-0 font-semibold tracking-wide disabled:hidden bg-black hover:bg-gray-800 rounded-md px-4 w-fit">
								Rename
							</Button>
							<Button
								type="button"
								onClick={() => {
									handleDownload()
								}}
								disabled={!fileDownloadReady}
								className="text-white font-semibold py-4 disabled:opacity-0 disabled:hidden bg-black  hover:bg-gray-800 rounded-md px-4">
								Download renamed file
							</Button>
						</div>
					</form>
				</div>
			</CardContent>
		</Card>
	)
}

export default ManualFileRename
