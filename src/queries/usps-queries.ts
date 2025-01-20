import { Query, QueryWithNames } from "@/types"

/*
 *==================================================
 * MARK:		   					     TYPES
 *==================================================
 */
/*
 *==================================================
 * MARK:						   COPY AND PASTE
 *==================================================

	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: false,
	},

 */

/*
 *==================================================
 * MARK:								 🟦     MAIN FILE
 *==================================================
 */

export const uspsQueries: (QueryWithNames | Query)[] = [
	// When Query sheet is "completed", remove Query from the type options above and change Verified to true, for Validated Verified and Required Alias.
	/*
	 *==================================================
	 * MARK:						         EXISTING
	 *==================================================
	 */
	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: false,
	},
	/*
	 *==================================================
	 * MARK:	             NOT ORIGINALLY INCLUDED
	 *==================================================
	 */
	{
		Marker: "PAY PERIOD",
		Text: "What is the PAY PERIOD?",
		Alias: "",
		Name: "payPeriod",
		Container: "basic",
		Verified: true, // returned a strange value format. Visually it appers like it should return "xx xx" but instead it returned "xx- xx". I configured the regex to accept both formats but it has not been tested.
	},
	/*
	 *==================================================
	 * MARK:						         CODES
	 *==================================================
	 */
	{
		Marker: "",
		Text: "",
		Alias: "",
		Name: "",
		Container: "",
		Verified: false,
	},
]
