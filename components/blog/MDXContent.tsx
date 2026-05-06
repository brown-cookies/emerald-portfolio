// Server Component — receives pre-compiled React element from compileMdx().
// compileMdx() is now called at the page level so headings can be extracted
// in the same pass and passed to <TOC />.
interface Props {
  content: React.ReactElement
}

export default function MDXContent({ content }: Props) {
  return (
    <article className="mdx-content max-w-none">
      {content}
    </article>
  )
}
