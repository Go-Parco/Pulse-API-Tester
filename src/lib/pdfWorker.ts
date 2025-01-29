import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"

// Set up the worker for PDF.js, loading it from the public directory
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs" // Relative path from the public folder

export { getDocument }
