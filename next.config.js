/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "media.licdn.com",
				port: "",
				pathname: "/dms/image/**",
			},
		],
	},
}

module.exports = nextConfig
