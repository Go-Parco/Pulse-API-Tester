// RULES
// Query function will either include a table and table lookup, or just a table lookup, or just a value.
// if the query includes a table, then the Table will be followed by a ">". The word before the ">" will be the table name.
// Nested tables can also be configured via multiple ">" symbols. ie: "Table1 > InnerTable"
// If the query includes a table lookup the row will be designated by the value before the "x" symbol, and the column will be designated by the word after the "x" symbol.
// The "x" symbol and the ">" symbol will both be surrounded by spaces and must be preceded and followed by a space and a word.
// If the query is just a value, then the value will be just a word.

// Full Query String conversion.
// All strings should start with "What is the" and end with a "?".
// If the query includes a table, then the string should convert to "In the <Table> table what is the <Value>?"
// Nested tables, the string should convert to "In the <Table1> table in the <InnerTable> table what is the <Value>?"
// If the query includes a table lookup, then the string should convert to "In the <Table> table what is the <Column> <Row>?"

// Examples:
// Example 1: Marker: "DEDUCTIONS > TSP SAVINGS x CURRENT"
// Output: "In the DEDUCTIONS table what is the Current TSP SAVINGS?"

// Example 2: Marker: "NET PAY x Current"
// Output: "What is the Current NET PAY?"

export const QueryConverter = (marker: string): string => {
	const convertMarker = (): string => {
		if (!marker || typeof marker !== "string") {
			throw new Error("Invalid input: Marker must be a non-empty string.")
		}

		const [tablePart, lookupPart] = marker.split(" x ")
		const tables = tablePart?.split(" > ").map((t) => t.trim())
		const isLookup = Boolean(lookupPart)

		if (!tables || tables.length === 0) {
			throw new Error("Invalid input: No tables found in the marker.")
		}

		if (isLookup) {
			// Handle the case where only a lookup is present without a nested table
			const [row, column] = lookupPart
				.split(" ")
				.map((part) => part.trim())

			if (tables.length === 1) {
				// Single table without nested hierarchy
				return `What is the ${row} ${tables[0]}?`
			}

			// Handle nested tables with lookup
			const tableHierarchy = tables
				.slice(0, -1)
				.map((table, index) =>
					index === 0
						? `In the ${table} table`
						: `in the ${table} table`
				)
				.join(" ")
			const finalTable = tables[tables.length - 1]
			return `${tableHierarchy} what is the ${row} ${finalTable}?`
		} else {
			// Handle cases without lookup
			if (tables.length > 1) {
				// Nested tables without lookup
				const tableHierarchy = tables
					.slice(0, -1)
					.map((table, index) =>
						index === 0
							? `In the ${table} table`
							: `in the ${table} table`
					)
					.join(" ")
				const finalValue = tables[tables.length - 1]
				return `${tableHierarchy} what is the ${finalValue}?`
			} else {
				// Single table without lookup
				return `What is the ${tables[0]}?`
			}
		}
	}

	const fullQuery = convertMarker()
	return fullQuery
}