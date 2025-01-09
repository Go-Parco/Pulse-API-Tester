export interface ChunkDefinition {
	id: string
	label: string
	value: "semantic" | "recursive"
	description: string
}

export const defaultChunks: ChunkDefinition[] = [
	{
		id: "semantic",
		label: "Semantic",
		value: "semantic",
		description: "Optimized for forms and structured documents",
	},
	{
		id: "recursive",
		label: "Recursive",
		value: "recursive",
		description: "Based on document structure",
	},
]
