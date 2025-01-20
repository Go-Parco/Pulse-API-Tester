export interface ChunkDefinition {
	id: string
	label: string
	value: "semantic" | "recursive"
	description: string
}

export const defaultChunks: ChunkDefinition[] = [
	{
		id: "semantic",
		label: "Semantic Chunking",
		value: "semantic",
		description: "Optimized for forms and structured documents",
	},
	{
		id: "recursive",
		label: "Recursive Chunking",
		value: "recursive",
		description: "Based on document structure",
	},
]
