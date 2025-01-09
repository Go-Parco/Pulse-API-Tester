export type ChunkDefinition = {
	id: string
	label: string
	value: string
	description: string
}

export const defaultChunks: ChunkDefinition[] = [
	{
		id: "semantic",
		label: "Semantic",
		value: "semantic",
		description: "Splits content based on meaning and context",
	},
	{
		id: "recursive",
		label: "Recursive",
		value: "recursive",
		description: "Breaks down content into smaller segments",
	},
	{
		id: "page",
		label: "Page",
		value: "page",
		description: "Divides by pages",
	},
	{
		id: "header",
		label: "Header",
		value: "header",
		description: "Splits based on document headers",
	},
]
