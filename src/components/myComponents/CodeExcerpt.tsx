"use client"
// Imports:
/* 
npm install react-syntax-highlighter --save
npm i --save-dev @types/react-syntax-highlighter

Requires creation of file in src/types/react-syntax-highlighter.d.ts

``` ts
declare module "react-syntax-highlighter/dist/esm/styles/prism" {
	export const oneLight: any
	export const oneDark: any
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/typescript" {
	const typescript: any
	export default typescript
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/javascript" {
	const javascript: any
	export default javascript
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/swift" {
	const swift: any
	export default swift
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/markdown" {
	const markdown: any
	export default markdown
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/css" {
	const css: any
	export default css
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/scss" {
	const scss: any
	export default scss
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/json" {
	const json: any
	export default json
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/bash" {
	const bash: any
	export default bash
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/go" {
	const go: any
	export default go
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/python" {
	const python: any
	export default python
}

declare module "react-syntax-highlighter/dist/esm/languages/prism/rust" {
	const rust: any
	export default rust
}

```
*/

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip"
import { toast } from "sonner"
import { Copy } from "lucide-react"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import {
	oneLight,
	oneDark,
} from "react-syntax-highlighter/dist/esm/styles/prism"

// Import languages
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript"
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript"
import swift from "react-syntax-highlighter/dist/esm/languages/prism/swift"
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown"
import css from "react-syntax-highlighter/dist/esm/languages/prism/css"
import scss from "react-syntax-highlighter/dist/esm/languages/prism/scss"
import json from "react-syntax-highlighter/dist/esm/languages/prism/json"
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash"
import go from "react-syntax-highlighter/dist/esm/languages/prism/go"
import python from "react-syntax-highlighter/dist/esm/languages/prism/python"
import rust from "react-syntax-highlighter/dist/esm/languages/prism/rust"

// Register languages
SyntaxHighlighter.registerLanguage("typescript", typescript)
SyntaxHighlighter.registerLanguage("javascript", javascript)
SyntaxHighlighter.registerLanguage("jsx", javascript)
SyntaxHighlighter.registerLanguage("tsx", typescript)
SyntaxHighlighter.registerLanguage("swift", swift)
SyntaxHighlighter.registerLanguage("markdown", markdown)
SyntaxHighlighter.registerLanguage("mdx", markdown)
SyntaxHighlighter.registerLanguage("css", css)
SyntaxHighlighter.registerLanguage("scss", scss)
SyntaxHighlighter.registerLanguage("json", json)
SyntaxHighlighter.registerLanguage("bash", bash)
SyntaxHighlighter.registerLanguage("go", go)
SyntaxHighlighter.registerLanguage("python", python)
SyntaxHighlighter.registerLanguage("rust", rust)

interface CodeExcerptProps {
	title?: string
	content: string
	language?: string
	hideCopy?: boolean
	className?: string
	copyContent?: string
	theme?: "light" | "dark"
}

export function CodeExcerpt({
	title = "Code Excerpt",
	content = "console.log('Hello, World!');",
	className,
	copyContent,
	hideCopy = false,
	language = "javascript",
	theme = "light",
}: CodeExcerptProps) {
	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(copyContent || content)
			toast.success("Copied to clipboard", {
				position: "top-right",
				className: "w-fit right-2 top-2 fixed",
			})
		} catch (err) {
			toast.error("Failed to copy", {
				position: "top-right",
				className: "w-fit",
			})
		}
	}

	const syntaxStyle = theme === "light" ? oneLight : oneDark
	const highlightLanguage = language === "env" ? "typescript" : language

	return (
		<div
			className={`space-y-2 mx-2 my-6 ${theme === "dark" ? "dark" : ""}`}>
			<div className="flex justify-between items-center w-auto mx-2">
				<h2 className="text-xl font-semibold ">{title}</h2>
				{language && (
					<span className="text-base text-gray-500 dark:text-gray-400">
						{language}
					</span>
				)}
			</div>
			<div className="relative w-auto">
				<SyntaxHighlighter
					language={highlightLanguage}
					style={syntaxStyle}
					wrapLongLines={true}
					customStyle={{
						padding: "1rem",
						borderRadius: "0.5rem",
						backgroundColor:
							theme === "light" ? "#f8f8f8" : "#282c34",
						overflow: "scroll",
						whiteSpace: "pre-wrap",
						wordBreak: "break-word",
						wordWrap: "break-word",
						overflowWrap: "break-word",
						maxWidth: "auto",
					}}>
					{content}
				</SyntaxHighlighter>
				{!hideCopy && (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									className="absolute top-2 right-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white dark:hover:text-white"
									onClick={copyToClipboard}
									aria-label="Copy code excerpt">
									<Copy className="h-4 w-4" />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p>Copy to clipboard</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				)}
			</div>
		</div>
	)
}
