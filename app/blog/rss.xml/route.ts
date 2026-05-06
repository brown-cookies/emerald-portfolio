import { getAllPosts, parseTags } from '@/lib/blog'
import { siteConfig } from '@/data/config'

const BASE_URL = 'https://mielle.dev'

function escapeXml(str: string): string {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&apos;')
}

export async function GET() {
  const posts = await getAllPosts()

  const items = posts.map(post => {
    const tags    = parseTags(post.tags)
    const url     = `${BASE_URL}/blog/${post.slug}`
    const pubDate = new Date(post.createdAt).toUTCString()

    const categories = tags.map(t => `    <category>${escapeXml(t)}</category>`).join('\n')

    return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <description>${escapeXml(post.description)}</description>
    <pubDate>${pubDate}</pubDate>
${categories}
  </item>`
  }).join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${BASE_URL}/blog</link>
    <description>${escapeXml(siteConfig.tagline)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type':  'application/rss+xml; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
