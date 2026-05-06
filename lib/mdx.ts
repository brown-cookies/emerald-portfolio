import { compileMDX } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import remarkGfm from 'remark-gfm'
import readingTime from 'reading-time'
import { mdxComponents } from '@/components/blog/mdx-components'
import type { Plugin } from 'unified'
import type { Root, Heading, Text, Parent } from 'mdast'
import { visit } from 'unist-util-visit'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TocHeading {
  id:    string   // slugified heading text — matches rehype-slug output
  text:  string   // plain text content of the heading
  depth: 2 | 3   // h2 or h3 (h1 is the post title, h4+ too deep)
}

// ─── Reading time ─────────────────────────────────────────────────────────────

export function calcReadingTime(content: string): string {
  return readingTime(content).text  // e.g. "4 min read"
}

// ─── Heading extractor (remark plugin) ───────────────────────────────────────
// Runs before rehype-slug so we use the same slugification logic.
// Collects h2 and h3 nodes, extracts their text, builds the TocHeading array.

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

function getNodeText(node: Heading): string {
  let text = ''
  visit(node as unknown as Parent, 'text', (child: Text) => {
    text += child.value
  })
  return text
}

function remarkExtractHeadings(headings: TocHeading[]): Plugin<[], Root> {
  return () => (tree: Root) => {
    visit(tree, 'heading', (node: Heading) => {
      if (node.depth !== 2 && node.depth !== 3) return
      const text = getNodeText(node)
      if (!text) return
      headings.push({ id: slugify(text), text, depth: node.depth })
    })
  }
}

// ─── Compile ──────────────────────────────────────────────────────────────────
// Returns both the rendered React element AND the extracted headings list.
// Callers (post page) use headings to render TOC; MDXContent receives pre-compiled content.

export async function compileMdx(source: string): Promise<{
  content:  React.ReactElement
  headings: TocHeading[]
}> {
  const headings: TocHeading[] = []

  const { content } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          remarkExtractHeadings(headings),  // populates headings[] as side-effect
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: { className: ['anchor'], ariaLabel: 'Link to section' },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme:           'tokyo-night',
              keepBackground:  false,
              defaultLang:     'plaintext',
            } as Parameters<typeof rehypePrettyCode>[0],
          ],
        ],
        format: 'mdx',
      },
    },
  })

  return { content, headings }
}
