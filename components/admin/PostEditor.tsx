"use client";
import type { Series } from "@/lib/db/schema";
import { revalidatePost } from "@/lib/actions/posts";
import { useState, useCallback, useTransition, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  Code2,
  Save,
  Loader2,
  Trash2,
  Globe,
  FileText,
  ExternalLink,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import type { PostWithSeries } from "@/lib/blog";
interface Props {
  post?: PostWithSeries;
  allSeries: Series[];
}

type SlugStatus = "idle" | "checking" | "available" | "taken";

export default function PostEditor({ post, allSeries }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // ── Form state ────────────────────────────────────────────────────────────
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [description, setDescription] = useState(post?.description ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [tags, setTags] = useState<string>(
    post ? (Array.isArray(post.tags) ? post.tags : []).join(", ") : "",
  );
  const [seriesId, setSeriesId] = useState<string>(
    post?.series ? String(post.series.id) : "",
  );
  const [seriesOrder, setSeriesOrder] = useState<string>(
    String(post?.seriesOrder ?? ""),
  );
  const [published, setPublished] = useState(post?.published ?? false);

  // ── Preview state ─────────────────────────────────────────────────────────
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [previewHtml, setPreviewHtml] = useState("");
  const [previewErr, setPreviewErr] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);

  // ── Feedback ──────────────────────────────────────────────────────────────
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ── B1: Slug collision detection ──────────────────────────────────────────
  const [slugStatus, setSlugStatus] = useState<SlugStatus>("idle");
  const debouncedSlug = useDebounce(slug, 500);

  useEffect(() => {
    if (!debouncedSlug) {
      setSlugStatus("idle");
      return;
    }
    // Skip check if slug hasn't changed from the saved post
    if (post && debouncedSlug === post.slug) {
      setSlugStatus("idle");
      return;
    }

    setSlugStatus("checking");
    const params = new URLSearchParams({ slug: debouncedSlug });
    if (post) params.set("excludeId", String(post.id));

    fetch(`/api/admin/posts?${params}`)
      .then((r) => r.json())
      .then((data) => setSlugStatus(data.available ? "available" : "taken"))
      .catch(() => setSlugStatus("idle"));
  }, [debouncedSlug, post]);

  // ── B2: Auto-save (edit mode only, 30s interval while dirty) ─────────────
  const [isDirty, setIsDirty] = useState(false);
  const [autoSaveAt, setAutoSaveAt] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  // Mark dirty on any field change
  useEffect(() => {
    setIsDirty(true);
  }, [
    title,
    slug,
    description,
    content,
    tags,
    seriesId,
    seriesOrder,
    published,
  ]);

  // Auto-save every 30s when dirty and editing an existing post
  useEffect(() => {
    if (!post || !isDirty) return;
    autoSaveTimer.current = setTimeout(async () => {
      setAutoSaving(true);
      await doSave(false, true); // silent auto-save
      setAutoSaveAt(new Date());
      setIsDirty(false);
      setAutoSaving(false);
    }, 30_000);
    return () => clearTimeout(autoSaveTimer.current);
  }, [
    isDirty,
    title,
    slug,
    description,
    content,
    tags,
    seriesId,
    seriesOrder,
    published,
  ]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Auto-slug from title (new posts only) ─────────────────────────────────
  function handleTitleChange(val: string) {
    setTitle(val);
    if (!post) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
    }
  }

  // ── MDX preview ───────────────────────────────────────────────────────────
  const fetchPreview = useCallback(async (src: string) => {
    if (!src.trim()) {
      setPreviewHtml("");
      return;
    }
    setPreviewLoading(true);
    setPreviewErr("");
    try {
      const res = await fetch("/api/admin/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: src }),
      });
      const data = await res.json();
      if (res.ok) setPreviewHtml(data.html);
      else setPreviewErr(data.error ?? "Preview failed");
    } catch {
      setPreviewErr("Network error");
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  function handleTabSwitch(next: "write" | "preview") {
    setTab(next);
    if (next === "preview") fetchPreview(content);
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  async function doSave(asDraft = false, silent = false) {
    if (!silent) {
      setError("");
      setSuccess("");
    }

    const tagArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const body = {
      title,
      slug,
      description,
      content,
      tags: tagArray,
      seriesId: seriesId ? Number(seriesId) : null,
      seriesOrder: seriesOrder ? Number(seriesOrder) : null,
      published: asDraft ? false : published,
    };

    const url = post ? `/api/admin/posts/${post.id}` : "/api/admin/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    if (res.ok) {
      if (!silent) {
        // Revalidate Cache for blog/ and /blog/[slug]
        await revalidatePost(data.post?.slug ?? slug);
        setSuccess(post ? "Post updated." : "Post created.");
      }
      if (!post)
        startTransition(() => router.push(`/admin/posts/${data.post.id}/edit`));
      else startTransition(() => router.refresh());
    } else {
      if (!silent) setError(data.error ?? "Save failed.");
    }
  }

  async function handleSave(asDraft = false) {
    await doSave(asDraft, false);
  }

  // ── Delete ────────────────────────────────────────────────────────────────
  async function handleDelete() {
    if (!post) return;
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      // ✅ Bust cache before navigating away
      await revalidatePost(post.slug);
      startTransition(() => router.push("/admin/posts"));
    }
  }

  // ── Slug badge ────────────────────────────────────────────────────────────
  const slugSuffix = slug ? `-2` : "";
  const suggestedSlug = slug + slugSuffix;

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground
    placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all`;

  return (
    <div className="space-y-6">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => handleSave(false)}
          disabled={
            isPending || !title.trim() || !slug.trim() || slugStatus === "taken"
          }
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500
            disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {post ? "Save changes" : "Create post"}
        </button>

        <button
          onClick={() => handleSave(true)}
          disabled={isPending || !title.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all"
        >
          <FileText className="w-4 h-4" /> Save as draft
        </button>

        {/* B3: Open preview button — edit mode only */}
        {post && (
          <a
            href={`/blog/${post.slug}?preview=true`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-sm text-muted-foreground hover:text-emerald-500 hover:border-emerald-500/30 transition-all"
          >
            <ExternalLink className="w-4 h-4" /> Open preview
          </a>
        )}

        {/* Published toggle */}
        <label className="flex items-center gap-2 cursor-pointer ml-auto">
          <span className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5" />
            {published ? "Published" : "Draft"}
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={published}
            onClick={() => setPublished((v) => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative ${published ? "bg-emerald-500" : "bg-muted border border-border"}`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${published ? "translate-x-5" : ""}`}
            />
          </button>
        </label>

        {/* B2: Auto-save indicator */}
        {post && (
          <span className="text-xs text-muted-foreground flex items-center gap-1.5">
            {autoSaving ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" /> Saving…
              </>
            ) : autoSaveAt ? (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-500" /> Saved{" "}
                {autoSaveAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            ) : null}
          </span>
        )}

        {post && (
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        )}
      </div>

      {/* Feedback */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}
      {success && (
        <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
          {success}
        </p>
      )}

      {/* ── Meta fields ── */}
      <div className="grid grid-cols-1 gap-3">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Post title *"
          className={inputCls}
        />

        {/* B1: Slug field with availability badge */}
        <div className="relative">
          <input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="slug-here *"
            className={`${inputCls} font-mono text-xs pr-32 ${slugStatus === "taken" ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/20" : ""}`}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs">
            {slugStatus === "checking" && (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                <span className="text-muted-foreground">Checking…</span>
              </>
            )}
            {slugStatus === "available" && (
              <>
                <CheckCircle className="w-3 h-3 text-emerald-500" />
                <span className="text-emerald-500">Available</span>
              </>
            )}
            {slugStatus === "taken" && (
              <>
                <AlertCircle className="w-3 h-3 text-red-400" />
                <span className="text-red-400">Taken</span>
              </>
            )}
          </span>
        </div>

        {/* B1: Suggest -2 suffix when slug is taken */}
        {slugStatus === "taken" && (
          <p className="text-xs text-muted-foreground -mt-1 pl-1">
            Slug already exists.{" "}
            <button
              onClick={() => setSlug(suggestedSlug)}
              className="text-emerald-500 hover:underline"
            >
              Use &ldquo;{suggestedSlug}&rdquo; instead
            </button>
          </p>
        )}

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description (shown in cards and meta)"
          className={inputCls}
        />
        <input
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags: ai, python, robotics  (comma separated)"
          className={inputCls}
        />
      </div>

      {/* Series */}
      <div className="grid grid-cols-2 gap-3">
        <select
          value={seriesId}
          onChange={(e) => setSeriesId(e.target.value)}
          className={inputCls}
        >
          <option value="">No series</option>
          {allSeries.map((s) => (
            <option key={s.id} value={s.id}>
              {s.title}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={seriesOrder}
          onChange={(e) => setSeriesOrder(e.target.value)}
          placeholder="Part # in series (1, 2, 3…)"
          min={1}
          className={inputCls}
        />
      </div>

      {/* ── Content editor — write / preview tabs ── */}
      <div className="rounded-2xl border border-border overflow-hidden">
        <div className="flex border-b border-border bg-muted/40">
          <button
            onClick={() => handleTabSwitch("write")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors border-r border-border
              ${tab === "write" ? "text-foreground bg-card" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Code2 className="w-4 h-4" /> Write
          </button>
          <button
            onClick={() => handleTabSwitch("preview")}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors
              ${tab === "preview" ? "text-foreground bg-card" : "text-muted-foreground hover:text-foreground"}`}
          >
            <Eye className="w-4 h-4" />
            Preview
            {previewLoading && <Loader2 className="w-3 h-3 animate-spin" />}
          </button>
          <span className="ml-auto px-4 py-2.5 text-xs text-muted-foreground self-center">
            {content.split(/\s+/).filter(Boolean).length} words
          </span>
        </div>

        {tab === "write" ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`# Your post title\n\nStart writing MDX here…\n\n\`\`\`ts\nconst hello = "world"\n\`\`\`\n\n<Callout type="info">You can use custom components</Callout>`}
            rows={28}
            className="w-full px-5 py-4 bg-background text-sm font-mono text-foreground
              placeholder:text-muted-foreground/40 focus:outline-none resize-none leading-relaxed"
          />
        ) : (
          <div className="min-h-[420px] px-8 py-6 bg-background">
            {previewErr ? (
              <p className="text-sm text-red-400 font-mono">{previewErr}</p>
            ) : previewHtml ? (
              <article
                className="mdx-content"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <p className="text-muted-foreground/40 text-sm">
                Nothing to preview yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
