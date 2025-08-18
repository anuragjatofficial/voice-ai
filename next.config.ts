/** @type {import('next').NextConfig} */

const nextConfig: import('next').NextConfig = {
  experimental: {
    forceSwcTransforms: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
