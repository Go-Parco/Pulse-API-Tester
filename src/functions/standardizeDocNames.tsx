const earningsAndLeaveNameStndz = (name: string) => {
	const lowercase = name.toLowerCase()
	switch (lowercase) {
		case "earnings and leave statement":
			return "Earnings and Leave Statement"
		case "statement of earnings and leave":
			return "Earnings and Leave Statement"
		case "civilian leave and earnings statement":
			return "Earnings and Leave Statement"
		default:
			"civilian leave and earnings statement les"
			return name
	}
}
