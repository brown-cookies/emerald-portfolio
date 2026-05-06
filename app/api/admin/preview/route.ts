import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'

// POST /api/admin/preview — converts MDX to raw HTML string without React
export async function POST(req: NextRequest) {
  if (!(await getSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { content } = await req.json() as { content: string }
  if (!content) return NextResponse.json({ html: '' })

  try {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeSlug)
      .use(rehypePrettyCode, {
        theme: 'tokyo-night',
        keepBackground: false,
        defaultLang: 'plaintext',
      } as Parameters<typeof rehypePrettyCode>[0])
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content)

    return NextResponse.json({ html: String(file) })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'MDX compile error'
    return NextResponse.json({ error: msg }, { status: 422 })
  }
}