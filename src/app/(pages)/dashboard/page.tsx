"use client"

import { Activity, Code, FileType, CircleDollarSign } from "lucide-react"

export default function Dashboard() {
	return (
		<div className="flex-1 p-8">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Welcome Section */}
				<div className="space-y-4">
					<h1 className="text-3xl font-bold text-gray-900">
						Welcome to the Document Processing Demo
					</h1>
					<p className="text-lg text-gray-600 max-w-3xl">
						Explore our collection of powerful document processing
						tools. Whether you're looking to extract text, analyze
						documents, or process forms, we've got you covered.
					</p>
				</div>

				{/* Quick Start Section */}
				<div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
					<h2 className="text-xl font-semibold text-gray-900">
						Quick Start Guide
					</h2>
					<p className="text-gray-600">
						New to document processing? Start here! Each tool comes
						with a sample document so you can try it out instantly.
					</p>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						<div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
							<div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
								<span className="text-blue-600 font-bold">
									1
								</span>
							</div>
							<h3 className="font-medium">Choose a Tool</h3>
							<p className="text-sm text-gray-600">
								Select any tool from the sidebar to get started.
								Each one is designed for specific document
								processing needs.
							</p>
						</div>
						<div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
							<div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
								<span className="text-blue-600 font-bold">
									2
								</span>
							</div>
							<h3 className="font-medium">Try the Demo</h3>
							<p className="text-sm text-gray-600">
								Click "Use Default" to test with our sample
								document, or upload your own document to see how
								it works.
							</p>
						</div>
						<div className="p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-2">
							<div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
								<span className="text-blue-600 font-bold">
									3
								</span>
							</div>
							<h3 className="font-medium">View Results</h3>
							<p className="text-sm text-gray-600">
								Watch as the tool processes your document and
								displays the results in an easy-to-understand
								format.
							</p>
						</div>
					</div>
				</div>

				{/* Available Tools Section */}
				<div className="space-y-6">
					<h2 className="text-2xl font-semibold text-gray-900">
						Available Tools
					</h2>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Pulse API Card */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-md bg-blue-100 flex items-center justify-center">
										<Activity className="w-6 h-6 text-blue-600" />
									</div>
									<h3 className="text-lg font-semibold">
										Pulse - Document Processing
									</h3>
								</div>
								<p className="text-gray-600 mb-4">
									Extract text, tables, and structured data
									from your documents. Perfect for processing
									invoices, forms, and financial documents.
								</p>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Extract text and data instantly
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Process large documents asynchronously
									</div>
								</div>
							</div>
						</div>

						{/* Tesseract Card */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-md bg-fuchsia-100 flex items-center justify-center">
										<Code className="w-6 h-6 text-fuchsia-600" />
									</div>
									<h3 className="text-lg font-semibold">
										Tesseract.js - OCR with Search
									</h3>
								</div>
								<p className="text-gray-600 mb-4">
									Convert images and scanned documents into
									searchable text. Great for making old
									documents searchable and accessible.
								</p>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Extract text from images
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Search through extracted content
									</div>
								</div>
							</div>
						</div>

						{/* Textract Card */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-md bg-amber-100 flex items-center justify-center">
										<FileType className="w-6 h-6 text-amber-600" />
									</div>
									<h3 className="text-lg font-semibold">
										Textract -Form & Table Processing
									</h3>
								</div>
								<p className="text-gray-600 mb-4">
									Automatically extract structured data from
									forms and tables in your documents. Ideal
									for processing forms and tabular data.
								</p>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Extract form fields automatically
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Process tables with high accuracy
									</div>
								</div>
							</div>
						</div>

						{/* Nyckel Card */}
						<div className="bg-white rounded-lg shadow-lg overflow-hidden">
							<div className="p-6">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-10 h-10 rounded-md bg-green-100 flex items-center justify-center">
										<CircleDollarSign className="w-6 h-6 text-green-600" />
									</div>
									<h3 className="text-lg font-semibold">
										Nyckel -Document Type Identifier
									</h3>
								</div>
								<p className="text-gray-600 mb-4">
									Automatically identify the type of document
									you're working with. Perfect for sorting and
									categorizing documents.
								</p>
								<div className="space-y-2">
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Identify document types instantly
									</div>
									<div className="flex items-center gap-2 text-sm text-gray-600">
										<span className="w-2 h-2 rounded-full bg-green-500"></span>
										Get confidence scores for predictions
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Help Section */}
				<div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
					<h2 className="text-lg font-semibold text-gray-900 mb-4">
						Need Help?
					</h2>
					<p className="text-gray-600">
						Each tool comes with detailed instructions and sample
						documents. If you need more help, look for the
						information icon (ℹ️) in each tool's interface for
						specific guidance.
					</p>
				</div>
			</div>
		</div>
	)
}
