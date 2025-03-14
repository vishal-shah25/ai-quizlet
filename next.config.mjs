/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_GEMINI_API_KEY: process.env.NEXT_GEMINI_API_KEY,
  },
};

export default nextConfig;
