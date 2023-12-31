/** @type {import('next').NextConfig} */
const nextConfig = {
  
  reactStrictMode: true,
  trailingSlash: true,

  images: {
    remotePatterns: [
    {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: ''
    }
    ]
  },

}

module.exports = nextConfig
