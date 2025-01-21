import React from "react"
import {
	AiFillFileImage,
	AiFillFilePdf,
	AiFillFileWord,
	AiFillFileExcel,
	AiFillFilePpt,
	AiFillFileText,
	AiFillFile,
} from "react-icons/ai"

export const getFileIcon = (filename: string, size: number = 24) => {
	const extension = filename.split(".").pop()?.toLowerCase() || ""
	const props = { size, className: "text-zinc-500" }

	switch (extension) {
		case "jpg":
		case "jpeg":
		case "png":
		case "gif":
		case "bmp":
		case "webp":
			return <AiFillFileImage {...props} />
		case "pdf":
			return <AiFillFilePdf {...props} />
		case "doc":
		case "docx":
			return <AiFillFileWord {...props} />
		case "xls":
		case "xlsx":
			return <AiFillFileExcel {...props} />
		case "ppt":
		case "pptx":
			return <AiFillFilePpt {...props} />
		case "txt":
		case "rtf":
			return <AiFillFileText {...props} />
		default:
			return <AiFillFile {...props} />
	}
}
