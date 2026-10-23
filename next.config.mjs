/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_READLY_API_URL: process.env.NEXT_PUBLIC_READLY_API_URL,
    NEXT_PUBLIC_TINYMCE_API_KEY: process.env.NEXT_PUBLIC_TINYMCE_API_KEY,
    NEXT_PUBLIC_JWT_SECRET_KEY: process.env.NEXT_PUBLIC_JWT_SECRET_KEY,
    NEXT_PUBLIC_CLIENT_URL: process.env.NEXT_PUBLIC_CLIENT_URL,
    NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY:
      process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'shopping-phinf.pstatic.net',
      },
    ],
  },
};

export default nextConfig;
