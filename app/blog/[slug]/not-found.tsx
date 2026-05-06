import Link from 'next/link'
import { ArrowLeft, FileQuestion } from 'lucide-react'

export default function PostNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
      <FileQuestion className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
      <h1 className="font-display font-bold text-2xl text-foreground mb-2">Post not found</h1>
      <p className="text-muted-foreground mb-8">
        This post may have been removed or the URL is incorrect.
      </p>
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to all posts
      </Link>
    </div>
  )
}
