"use client";
import { useEffect, useState, useTransition } from "react";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Loader2,
  MessageSquare,
  ExternalLink,
} from "lucide-react";

export const dynamic = "force-dynamic";

interface CommentRow {
  id: number;
  name: string;
  email: string;
  content: string;
  approved: boolean;
  createdAt: string;
  postSlug: string;
  postTitle: string;
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPending, start] = useTransition();
  const [filter, setFilter] = useState<"all" | "pending" | "approved">(
    "pending",
  );

  async function load() {
    setLoading(true);
    // Re-use the admin blog query via a lightweight fetch
    const res = await fetch("/api/admin/comments-list");
    if (res.ok) setComments(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(id: number) {
    start(async () => {
      await fetch(`/api/admin/comments/${id}`, { method: "PATCH" });
      setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved: !c.approved } : c)),
      );
    });
  }

  async function remove(id: number) {
    if (!confirm("Delete this comment permanently?")) return;
    start(async () => {
      await fetch(`/api/admin/comments/${id}`, { method: "DELETE" });
      setComments((prev) => prev.filter((c) => c.id !== id));
    });
  }

  const filtered = comments.filter((c) => {
    if (filter === "pending") return !c.approved;
    if (filter === "approved") return c.approved;
    return true;
  });

  const pending = comments.filter((c) => !c.approved).length;
  const approved = comments.filter((c) => c.approved).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Comments</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {pending > 0
            ? `${pending} pending approval`
            : "All comments reviewed"}
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-muted/50 border border-border w-fit">
        {(
          [
            ["pending", `Pending (${pending})`],
            ["approved", `Approved (${approved})`],
            ["all", `All (${comments.length})`],
          ] as const
        ).map(([val, label]) => (
          <button
            key={val}
            onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              filter === val
                ? "bg-card text-foreground shadow-sm border border-border"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed border-border">
          <MessageSquare className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground text-sm">No comments here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className={`rounded-xl border p-5 transition-colors ${
                c.approved
                  ? "border-border bg-card/60"
                  : "border-amber-500/20 bg-amber-500/5"
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-foreground">
                      {c.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {c.email}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        c.approved
                          ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                          : "text-amber-500 bg-amber-500/10 border-amber-500/20"
                      }`}
                    >
                      {c.approved ? "Approved" : "Pending"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-muted-foreground">on</span>
                    <a
                      href={`/blog/${c.postSlug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-emerald-500 hover:underline flex items-center gap-0.5"
                    >
                      {c.postTitle} <ExternalLink className="w-3 h-3" />
                    </a>
                    <span className="text-xs text-muted-foreground">
                      ·{" "}
                      {new Date(c.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => toggle(c.id)}
                    disabled={isPending}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                      c.approved
                        ? "border-border text-muted-foreground hover:border-amber-500/40 hover:text-amber-500"
                        : "border-emerald-500/30 text-emerald-500 bg-emerald-500/10 hover:bg-emerald-500/20"
                    }`}
                  >
                    {c.approved ? (
                      <>
                        <XCircle className="w-3.5 h-3.5" /> Unapprove
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Approve
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => remove(c.id)}
                    disabled={isPending}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed border-t border-border/60 pt-3 whitespace-pre-wrap">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
