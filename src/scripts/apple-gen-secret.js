import { SignJWT } from "jose"
import { createPrivateKey } from "crypto"
import { readFileSync } from "fs"
import { config } from "dotenv"

// From: https://gist.github.com/balazsorban44/09613175e7b37ec03f676dcefb7be5eb

// Load environment variables
config()

if (process.argv.includes("--help") || process.argv.includes("-h")) {
	console.log(`
Creates a JWT from the components found at Apple.
By default, the JWT has a 6 months expiry date.
Read more: https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens#3262048
Usage:
node apple.mjs [--kid] [--iss] [--private_key] [--sub] [--expires_in] [--exp]
  
Options:
  --help                 Print this help message
  --kid, --key_id        The key id of the private key
  --iss, --team_id       The Apple team ID
  --private_key          The private key to use to sign the JWT. (Starts with -----BEGIN PRIVATE KEY-----)
  --sub, --client_id     The client id to use in the JWT.
  --expires_in           Number of seconds from now when the JWT should expire. Defaults to 6 months.
  --exp                  Future date in seconds when the JWT expires
  `)
} else {
	// Get values from environment variables first
	const envValues = {
		kid: process.env.APPLE_KEY_ID,
		iss: process.env.APPLE_TEAM_ID,
		sub: process.env.APPLE_CLIENT_ID,
		private_key: process.env.APPLE_PRIVATE_KEY,
	}

	// Parse command line arguments
	const args = process.argv.slice(2).reduce((acc, arg, i) => {
		const match = /^--(\w+)/.exec(arg)
		const value = process.argv[i + 1]
		if (match?.[1] && value) {
			const key = match[1].toLowerCase()
			if (key === "expires_in" || key === "exp") {
				acc[key] = parseInt(value)
			} else {
				acc[key] = value
			}
		}
		return acc
	}, {})

	console.log("Received arguments:", args)

	// Merge environment variables with command line arguments (command line takes precedence)
	const finalArgs = { ...envValues, ...args }

	console.log("Using values:", {
		kid: finalArgs.kid,
		iss: finalArgs.iss,
		sub: finalArgs.sub,
		private_key: "***", // Don't log the private key
	})

	const {
		team_id,
		iss = team_id ?? finalArgs.iss,
		private_key,
		client_id,
		sub = client_id ?? finalArgs.sub,
		key_id,
		kid = key_id ?? finalArgs.kid,
		expires_in = 86400 * 180,
		exp = Math.ceil(Date.now() / 1000) + expires_in,
	} = finalArgs

	if (!kid || !iss || !sub || !private_key) {
		console.error(
			"Missing required arguments. Required: kid, iss, sub, private_key"
		)
		process.exit(1)
	}

	// Helper to format private key
	const formatPrivateKey = (key) => {
		if (key.includes("file:")) {
			const filePath = key.replace("file:", "")
			return readFileSync(filePath, "utf-8")
		}
		// Replace literal \n with actual newlines
		let formattedKey = key.replace(/\\n/g, "\n")

		// Ensure key has proper PEM format
		if (!formattedKey.includes("-----BEGIN PRIVATE KEY-----")) {
			formattedKey = `-----BEGIN PRIVATE KEY-----\n${formattedKey}`
		}
		if (!formattedKey.includes("-----END PRIVATE KEY-----")) {
			formattedKey = `${formattedKey}\n-----END PRIVATE KEY-----`
		}

		// Debug output
		console.log("Formatted key:", formattedKey)

		return formattedKey
	}

	try {
		const expiresAt = Math.ceil(Date.now() / 1000) + expires_in
		const expirationTime = exp ?? expiresAt

		const privateKey = createPrivateKey({
			key: formatPrivateKey(private_key),
			format: "pem",
			type: "pkcs8",
		})

		console.log(`
Apple client secret generated. Valid until: ${new Date(
			expirationTime * 1000
		).toISOString()}
${await new SignJWT({})
	.setAudience("https://appleid.apple.com")
	.setIssuer(iss)
	.setIssuedAt()
	.setExpirationTime(expirationTime)
	.setSubject(sub)
	.setProtectedHeader({ alg: "ES256", kid })
	.sign(privateKey)}`)
	} catch (error) {
		console.error("Error details:", error)
		process.exit(1)
	}
}
