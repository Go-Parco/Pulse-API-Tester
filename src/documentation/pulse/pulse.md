# Pulse API Documentation

## Overview

The Pulse API provides functionality to query and aggregate document data across multiple sources.

## Basic Usage

### Querying Documents

```typescript
// Basic query example
const query = await pulseQuery({
	collection: "documents",
	filters: {
		status: "active",
		type: "article",
	},
})
Results
typescript
// Process query results
const documents = await processDocuments(query.results)
Documents
typescript
// Complete workflow example
const rawQuery = await pulseQuery({
	collection: "documents",
	filters: { status: "active" },
})
const processedData = await processDocuments(rawQuery.results)
const finalOutput = await transformDocuments(processedData)
Data
typescript
// Aggregation example
const stats = await aggregateDocuments({
	documents: processedData,
	groupBy: "category",
})
typescript
interface PulseResponse {
	results: Document[]
	metadata: {
		total: number
		page: number
		pageSize: number
	}
}
Handling
typescript
try {
	const query = await pulseQuery(params)
} catch (error) {
	if (error instanceof PulseError) {
		// Handle Pulse-specific errors
	}
	// Handle other errors
}
```
