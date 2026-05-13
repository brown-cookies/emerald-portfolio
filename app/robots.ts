import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Block all crawlers from admin, API, and preview routes.
        // Without this, Google indexes /admin/login, /api/admin/*, etc.
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/admin/',
          '/api/',
          '/blog/*?preview=true',
        ],
      },
    ],
    sitemap: 'https://mielle.tech/sitemap.xml',
  }
}
