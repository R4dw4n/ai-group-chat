/** @type {import('next').NextConfig} */

const nextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '45-159-248-44.nip.io', port: '', pathname: '/avatar/**' }],
  },
};

export default nextConfig;