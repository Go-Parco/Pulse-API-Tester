# Pulse Document Extraction

## API Endpoints

### Synchronous Extraction

**File:** `src/app/api/pulse/extract/route.ts`

**Endpoint:** `POST /api/pulse/extract`

Extracts content from PDF documents with a 55-second timeout.

#### Request Body

```typescript
{
	fileUrl: string;    // URL of the PDF file to process
	method?: "semantic" | "recursive";  // Chunking method
}
```

#### Response Format

```typescript
{
	result: {
		text: string // Extracted text content
		tables: Array<{
			// Array of extracted tables
			data: any[][] // Table data as 2D array
		}>
	}
}
```

## Client Integration

### usePulseExtract Hook

**File:** `src/hooks/usePulseExtract.ts`

A React hook that manages the document extraction workflow.

#### Hook Interface

```typescript
interface UsePulseExtractReturn {
	extractedData: PulseExtractResponse | null
	extractionStatus: string
	progress: number
	timeRemaining: number | null
	estimatedTime: string | null
	startExtraction: (fileUrl: string) => Promise<void>
	resetExtraction: () => void
	setChunkingMethod: (method: "semantic" | "recursive") => void
}
```

#### Usage Example

```typescript
const {
	extractedData,
	extractionStatus,
	progress,
	startExtraction,
	resetExtraction,
	setChunkingMethod,
} = usePulseExtract()

// Start extraction
await startExtraction(fileUrl)

// Reset state
resetExtraction()

// Change chunking method
setChunkingMethod("semantic")
```

#### Features

-   Progress tracking
-   Extraction status updates
-   Error handling
-   Automatic polling for async operations
-   Configurable chunking methods

#### State Management

```typescript
const [extractionStatus, setExtractionStatus] = useState("")
const [progress, setProgress] = useState(0)
const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
const [estimatedTime, setEstimatedTime] = useState<string | null>(null)
const [extractedData, setExtractedData] = useState<PulseExtractResponse | null>(
	null
)
```

#### Extraction Process

1. Initiates extraction request
2. Monitors progress
3. Handles completion/failure
4. Updates UI with status

```typescript
const startExtraction = async (fileUrl: string) => {
	try {
		setExtractionStatus("Processing document...")
		setProgress(0)

		const response = await fetch("/api/pulse/extract", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fileUrl,
				method: chunkingMethod,
			}),
		})

		const data = await response.json()

		if ("result" in data) {
			setExtractedData(data.result)
			setProgress(100)
			setExtractionStatus("Extraction completed!")
		}
	} catch (error) {
		setExtractionStatus(`Failed to extract: ${error.message}`)
		setProgress(0)
		setExtractedData(null)
	}
}
```

### Error Handling

-   Network errors
-   Timeout handling
-   API errors
-   Invalid file formats

### Integration Example

```typescript
function DocumentProcessor() {
	const { extractedData, extractionStatus, progress, startExtraction } =
		usePulseExtract()

	const handleFileUpload = async (file: File) => {
		const fileUrl = await uploadFile(file)
		await startExtraction(fileUrl)
	}

	return (
		<div>
			<FileUploader onUpload={handleFileUpload} />
			<ProgressBar value={progress} />
			<StatusDisplay status={extractionStatus} />
			{extractedData && <ResultsView data={extractedData} />}
		</div>
	)
}
```

## Configuration

### Environment Variables

```env
PULSE_API_KEY=your_pulse_api_key
```

### Timeout Settings

```typescript
const TIMEOUT = 55000 // 55 seconds
```

### Chunking Methods

-   `semantic`: Optimized for forms and structured documents
-   `recursive`: Based on document structure

## Best Practices

1. Always handle errors gracefully
2. Show clear progress indicators
3. Provide feedback on extraction status
4. Clean up resources on component unmount
5. Implement proper timeout handling
