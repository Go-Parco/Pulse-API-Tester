import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	experimental: {
		serverComponentsExternalPackages: ["tesseract.js"],
		serverActions: {
			bodySizeLimit: "50mb",
		},
	},
	webpack: (config, { isServer }) => {
		// Configure webpack to handle WASM files
		config.experiments = {
			...config.experiments,
			asyncWebAssembly: true,
			layers: true,
		}

		// Add WASM file handling
		config.module.rules.push({
			test: /\.wasm$/,
			type: "asset/resource",
		})

		return config
	},
}

export default nextConfig
