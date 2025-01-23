import { TextractClient } from "@aws-sdk/client-textract"
import { env } from "@/env"

export const textractClient = new TextractClient({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	},
})
