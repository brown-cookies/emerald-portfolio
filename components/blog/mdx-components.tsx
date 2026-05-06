import type { MDXComponents } from 'mdx/types'
import Link from 'next/link'
import Image from 'next/image'
import Callout from '@/components/blog/Callout'

// Custom components that replace standard HTML elements inside MDX.
// These are passed to compileMDX() in lib/mdx.ts.
export const mdxComponents: MDXComponents = {

  // ── Headings ────────────────────────────────────────────────────────────────
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold text-foreground mt-10 mb-4 font-display" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-bold text-foreground mt-10 mb-3 font-display border-b border-border pb-2" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-semibold text-foreground mt-8 mb-2 font-display" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="text-base font-semibold text-foreground mt-6 mb-2" {...props}>
      {children}
    </h4>
  ),

  // ── Paragraph ───────────────────────────────────────────────────────────────
  p: ({ children, ...props }) => (
    <p className="text-muted-foreground leading-7 mb-4 [&:not(:first-child)]:mt-0" {...props}>
      {children}
    </p>
  ),

  // ── Links ────────────────────────────────────────────────────────────────────
  a: ({ href, children, ...props }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-emerald-500 hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 hover:decoration-emerald-400 transition-colors"
          {...props}
        >
          {children}
        </a>
      )
    }
    return (
      <Link
        href={href ?? '#'}
        className="text-emerald-500 hover:text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 transition-colors"
        {...props}
      >
        {children}
      </Link>
    )
  },

  // ── Inline code ─────────────────────────────────────────────────────────────
  // rehype-pretty-code handles fenced code blocks (```).
  // This handles backtick inline code like `variable`.
  code: ({ children, ...props }) => (
    <code
      className="px-1.5 py-0.5 rounded-md text-[0.85em] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
      {...props}
    >
      {children}
    </code>
  ),

  // ── Code blocks ──────────────────────────────────────────────────────────────
  // rehype-pretty-code transforms fenced blocks into <figure data-rehype-pretty-code-figure>
  // wrapping a <pre><code>. We style those via globals.css, not here.
  // This pre override keeps unstyled blocks clean if they slip through.
  pre: ({ children, ...props }) => (
    <pre
      className="overflow-x-auto rounded-xl border border-border bg-card p-4 text-sm font-mono my-6"
      {...props}
    >
      {children}
    </pre>
  ),

  // ── Lists ────────────────────────────────────────────────────────────────────
  ul: ({ children, ...props }) => (
    <ul className="my-4 ml-6 list-disc text-muted-foreground space-y-1.5 [&>li]:leading-7" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="my-4 ml-6 list-decimal text-muted-foreground space-y-1.5 [&>li]:leading-7" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-7" {...props}>{children}</li>
  ),

  // ── Blockquote ───────────────────────────────────────────────────────────────
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="my-6 border-l-4 border-emerald-500/50 pl-4 italic text-muted-foreground bg-emerald-500/5 py-3 pr-4 rounded-r-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // ── Horizontal rule ──────────────────────────────────────────────────────────
  hr: () => <hr className="my-8 border-border" />,

  // ── Table (remark-gfm) ───────────────────────────────────────────────────────
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm" {...props}>{children}</table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-muted/50 border-b border-border" {...props}>{children}</thead>
  ),
  th: ({ children, ...props }) => (
    <th className="px-4 py-3 text-left font-semibold text-foreground" {...props}>{children}</th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-4 py-3 text-muted-foreground border-t border-border/50" {...props}>{children}</td>
  ),

  // ── Image ────────────────────────────────────────────────────────────────────
  img: ({ src, alt, ...props }) => (
    <span className="block my-6">
      <Image
        src={src ?? ''}
        alt={alt ?? ''}
        width={800}
        height={450}
        className="rounded-xl border border-border w-full h-auto"
        {...(props as object)}
      />
      {alt && (
        <span className="block text-center text-xs text-muted-foreground mt-2 italic">{alt}</span>
      )}
    </span>
  ),

  // ── Custom components ─────────────────────────────────────────────────────
  Callout,

  // ── Strong / Em ──────────────────────────────────────────────────────────────
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-foreground" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }) => (
    <em className="italic text-muted-foreground/90" {...props}>{children}</em>
  ),
}
