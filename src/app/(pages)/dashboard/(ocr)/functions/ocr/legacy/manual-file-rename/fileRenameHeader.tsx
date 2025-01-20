import React from "react"

const FileRenameHeader = () => {
	return (
		<div className="!bg-gray-700 rounded-xl p-4 my-4 text-sm">
			<span className="text-zinc-400 w-full p-2">
				Document will be renamed in the format:
			</span>
			<code className="text-white pl-2">
				[FileName]_[AccountType].[originalFileType]
			</code>
		</div>
	)
}

export default FileRenameHeader
