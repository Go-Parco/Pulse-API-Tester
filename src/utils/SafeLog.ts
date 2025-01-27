interface SafeLogProps {
	display: boolean
	log: Record<string, any>
}

export const SafeLog = ({ display, log }: SafeLogProps) => {
	if (process.env.NODE_ENV === "development") {
		if (display) {
			console.log(log)
		} else {
			// console.debug(log)
		}
	}
}
