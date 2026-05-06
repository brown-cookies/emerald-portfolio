import type { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/blog'

const BASE = 'https://mielle.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const static_routes: MetadataRoute.Sitemap = [
    { url: BASE,                      lastModified: new Date(), changeFrequency: 'monthly',  priority: 1    },
    { url: `${BASE}/certifications`,  lastModified: new Date(), changeFrequency: 'monthly',  priority: 0.8  },
    { url: `${BASE}/blog`,            lastModified: new Date(), changeFrequency: 'weekly',   priority: 0.9  },
  ]

  // Dynamic blog post routes
  let postRoutes: MetadataRoute.Sitemap = []
  try {
    const posts = await getAllPosts()
    postRoutes = posts.map(post => ({
      url:             `${BASE}/blog/${post.slug}`,
      lastModified:    new Date(post.updatedAt),
      changeFrequency: 'monthly' as const,
      priority:        0.7,
    }))
  } catch {
    // DB not connected at build time — sitemap still works, just without posts
  }

  return [...static_routes, ...postRoutes]
}
