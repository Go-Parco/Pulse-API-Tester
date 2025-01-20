const formatToNumber= (value: string) => {
	// remove all whitespace, "$", and "," as well as the word "Annual"
	return Number(value.replace(/\s/g, "").replace(/[$,]/g, "").replace("Annual", ""));
}

export { formatToNumber }