/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // optimizePackageImports is stable in Next.js 15 — moved to top level.
  // NOTE: framer-motion must NOT be here. It relies on shared internal
  // initialization across its modules; optimizing its imports breaks that
  // and causes all animations to get stuck at their initial state (opacity: 0),
  // resulting in a blank page.
  optimizePackageImports: ['lucide-react'],
}
 
module.exports = nextConfig
 