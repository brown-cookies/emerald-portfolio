import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getPostBySlug,
  getPostBySlugAdmin,
  getAllPosts,
  getSeriesPosts,
  getRelatedPosts,
  getApprovedComments,
  parseTags,
} from "@/lib/blog";
import { compileMdx } from "@/lib/mdx";
import { siteConfig } from "@/data/config";
import PostHeader from "@/components/blog/PostHeader";
import MDXContent from "@/components/blog/MDXContent";
import SeriesNav from "@/components/blog/SeriesNav";
import RelatedPosts from "@/components/blog/RelatedPosts";
import CommentList from "@/components/blog/CommentList";
import CommentForm from "@/components/blog/CommentForm";
import TOC from "@/components/blog/TOC";
import CopyButton from "@/components/blog/CopyButton";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { MessageSquare } from "lucide-react";

// ✅ ISR: regenerate cached page at most every 60 seconds
export const revalidate = 60;

// ✅ Allow new slugs not present at build time (e.g. new posts from /admin)
export const dynamicParams = true;

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} · ${siteConfig.name}`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.createdAt,
      authors: [siteConfig.name],
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const isPreview = preview === "true";

  const post = isPreview
    ? await getPostBySlugAdmin(slug)
    : await getPostBySlug(slug);
  if (!post) notFound();

  // compileMdx called here so headings can be extracted in the same pass
  const [{ content, headings }, seriesPosts, relatedPosts, approvedComments] =
    await Promise.all([
      compileMdx(post.content),
      post.seriesId ? getSeriesPosts(post.seriesId) : Promise.resolve([]),
      getRelatedPosts(post),
      getApprovedComments(post.id),
    ]);

  const currentTags = parseTags(post.tags);

  return (
    // Two-column on xl: [prose 672px] [gap 64px] [TOC 224px]
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* Reading progress — fills as user scrolls through the article */}
      <ReadingProgress />
      <div className="xl:flex xl:gap-16">
        {/* ── Main column ── */}
        <div className="flex-1 min-w-0 max-w-3xl">
          {/* Draft preview banner */}
          {isPreview && !post.published && (
            <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl border border-amber-500/30 bg-amber-500/8 text-sm text-amber-400">
              <span className="text-xs font-bold uppercase tracking-widest bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Draft
              </span>
              This post is unpublished. Only you can see this preview.
            </div>
          )}

          <PostHeader post={post} />

          {post.series && seriesPosts.length > 1 && (
            <SeriesNav
              series={post.series}
              posts={seriesPosts}
              currentSlug={post.slug}
            />
          )}

          {/* CopyButton attaches copy buttons to all code blocks after render */}
          <CopyButton />
          <MDXContent content={content} />

          {post.series && seriesPosts.length > 1 && (
            <SeriesNav
              series={post.series}
              posts={seriesPosts}
              currentSlug={post.slug}
            />
          )}

          <RelatedPosts posts={relatedPosts} currentTags={currentTags} />

          {/* Comments */}
          <section className="mt-16 pt-10 border-t border-border">
            <h2 className="flex items-center gap-2 font-display font-bold text-lg text-foreground mb-6">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              Comments
              {approvedComments.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({approvedComments.length})
                </span>
              )}
            </h2>
            <CommentList comments={approvedComments} />
            <CommentForm postId={post.id} />
          </section>
        </div>

        {/* ── TOC sidebar — desktop sticky, mobile floating button ── */}
        <TOC headings={headings} />
      </div>
    </div>
  );
}
