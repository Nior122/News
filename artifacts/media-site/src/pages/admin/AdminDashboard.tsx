import { useState, useEffect, useCallback, useRef, useId } from "react";
import { useLocation } from "wouter";
import RichEditor from "./RichEditor";

const CATEGORIES = ["Tech", "Culture", "Lifestyle", "AI Tools", "Phone Tips", "Productivity", "Trending"];

const AUTHORS = [
  { id: 1, name: "Maya Chen" },
  { id: 2, name: "James Okafor" },
  { id: 3, name: "Sofia Reyes" },
  { id: 4, name: "Liam Park" },
  { id: 5, name: "Anya Patel" },
];

interface Article {
  id: number;
  slug: string;
  title: string;
  subtitle: string | null;
  excerpt: string;
  body: string | null;
  category: string;
  authorId: number;
  imageUrl: string;
  readTime: number;
  views: number;
  featured: boolean;
  editorsPick: boolean;
  published: boolean;
  publishedAt: string;
  tags: string[];
}

type EditForm = Omit<Article, "id" | "views" | "publishedAt"> & { id?: number };

const emptyForm = (): EditForm => ({
  slug: "",
  title: "",
  subtitle: "",
  excerpt: "",
  body: "",
  category: "Tech",
  authorId: 1,
  imageUrl: "",
  readTime: 5,
  featured: false,
  editorsPick: false,
  published: true,
  tags: [],
});

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}`,
  };
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"edit" | "create" | "delete" | null>(null);
  const [form, setForm] = useState<EditForm>(emptyForm());
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean; deploy?: boolean } | null>(null);

  const showToast = (msg: string, ok = true, deploy = false) => {
    setToast({ msg, ok, deploy });
    setTimeout(() => setToast(null), deploy ? 6000 : 3000);
  };

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/articles", { headers: authHeaders() });
      if (res.status === 401) { setLocation("/admin/login"); return; }
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to load"); return; }
      setArticles(data);
    } catch {
      setError("Failed to load articles");
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) { setLocation("/admin/login"); return; }
    fetchArticles();
  }, [fetchArticles, setLocation]);

  function openEdit(a: Article) {
    setForm({ ...a, tags: a.tags ?? [] });
    setModal("edit");
  }

  function openCreate() {
    setForm(emptyForm());
    setModal("create");
  }

  function openDelete(a: Article) {
    setDeleteTarget(a);
    setModal("delete");
  }

  function closeModal() {
    setModal(null);
    setDeleteTarget(null);
  }

  async function handleTogglePublish(a: Article) {
    const res = await fetch(`/api/admin/articles/${a.id}/publish`, {
      method: "PATCH",
      headers: authHeaders(),
    });
    const data = await res.json();
    if (!res.ok) { showToast(data.error ?? "Failed to update", false); return; }
    const updated: Article = data;
    setArticles((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    showToast(
      updated.published
        ? "Article published — Vercel deploying in ~60s"
        : "Article unpublished — Vercel deploying in ~60s",
      true, true
    );
  }

  async function handleSave() {
    setSaving(true);
    const isEdit = modal === "edit" && form.id !== undefined;
    const url = isEdit ? `/api/admin/articles/${form.id}` : "/api/admin/articles";
    const method = isEdit ? "PUT" : "POST";
    const payload = {
      ...form,
      tags: typeof form.tags === "string"
        ? (form.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
        : form.tags,
    };

    try {
      const res = await fetch(url, { method, headers: authHeaders(), body: JSON.stringify(payload) });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Save failed", false); return; }
      const saved: Article = data;
      if (isEdit) {
        setArticles((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
      } else {
        setArticles((prev) => [saved, ...prev]);
      }
      closeModal();
      showToast(
        isEdit
          ? "Article updated — Vercel deploying in ~60s"
          : "Article created — Vercel deploying in ~60s",
        true, true
      );
    } catch {
      showToast("Save failed — check connection", false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/admin/articles/${deleteTarget.id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (!res.ok) { showToast("Delete failed", false); return; }
    setArticles((prev) => prev.filter((x) => x.id !== deleteTarget.id));
    closeModal();
    showToast("Article deleted — Vercel deploying in ~60s", true, true);
  }

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setLocation("/admin/login");
  }

  const filtered = articles.filter(
    (a) =>
      !search ||
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const total = articles.length;
  const publishedCount = articles.filter((a) => a.published !== false).length;
  const draftCount = total - publishedCount;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm px-5 py-3 rounded-xl text-sm font-medium shadow-xl border transition-all ${toast.ok ? "bg-emerald-950 border-emerald-800 text-emerald-300" : "bg-red-950 border-red-800 text-red-300"}`}>
          <p>{toast.msg}</p>
          {toast.deploy && (
            <p className="text-xs opacity-70 mt-1">Changes committed to GitHub → auto-deploying on Vercel</p>
          )}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/60 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-white">
              Pulse<span className="text-primary">Wire</span>
            </span>
            <span className="text-zinc-600 text-sm">/ Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-400 hover:text-zinc-200 transition px-3 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              View Site →
            </a>
            <button
              onClick={handleLogout}
              className="text-xs text-zinc-400 hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-zinc-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Deploy notice */}
        <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-3 text-sm text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          Every save commits to GitHub and Vercel auto-deploys in ~60 seconds
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Articles", value: total, color: "text-zinc-100" },
            { label: "Published", value: publishedCount, color: "text-emerald-400" },
            { label: "Drafts", value: draftCount, color: "text-amber-400" },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
              <p className="text-xs text-zinc-500 mb-1">{s.label}</p>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search articles…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={openCreate}
            className="bg-primary hover:bg-primary/90 text-white font-semibold text-sm px-5 py-2 rounded-lg transition whitespace-nowrap"
          >
            + New Article
          </button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-zinc-900 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <p className="text-red-400 text-sm">{error}</p>
        ) : (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-5 py-3 font-medium">Title</th>
                  <th className="text-left px-4 py-3 font-medium hidden md:table-cell">Category</th>
                  <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">Date</th>
                  <th className="text-center px-4 py-3 font-medium hidden sm:table-cell">Views</th>
                  <th className="text-center px-4 py-3 font-medium">Status</th>
                  <th className="text-center px-4 py-3 font-medium hidden lg:table-cell">Flags</th>
                  <th className="text-right px-5 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`border-b border-zinc-800/60 hover:bg-zinc-800/40 transition ${i === filtered.length - 1 ? "border-b-0" : ""}`}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-100 line-clamp-1 max-w-xs">{a.title}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{a.slug}</p>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className="text-xs bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full">{a.category}</span>
                    </td>
                    <td className="px-4 py-4 text-zinc-500 text-xs hidden lg:table-cell">
                      {new Date(a.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="px-4 py-4 text-center text-zinc-400 text-xs hidden sm:table-cell">
                      {(a.views ?? 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => handleTogglePublish(a)}
                        title={a.published !== false ? "Click to unpublish" : "Click to publish"}
                        className={`text-xs font-medium px-3 py-1 rounded-full transition ${a.published !== false ? "bg-emerald-950 text-emerald-400 hover:bg-emerald-900" : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"}`}
                      >
                        {a.published !== false ? "Live" : "Draft"}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center hidden lg:table-cell">
                      {a.featured && (
                        <span className="text-xs bg-amber-950 text-amber-400 px-2.5 py-1 rounded-full">Featured</span>
                      )}
                      {a.editorsPick && (
                        <span className="ml-1 text-xs bg-violet-950 text-violet-400 px-2.5 py-1 rounded-full">Pick</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEdit(a)}
                          className="text-xs text-zinc-400 hover:text-white transition px-3 py-1.5 rounded-lg hover:bg-zinc-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDelete(a)}
                          className="text-xs text-red-500 hover:text-red-400 transition px-3 py-1.5 rounded-lg hover:bg-red-950/40"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-zinc-500 text-sm">
                      No articles found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Edit / Create Modal */}
      {(modal === "edit" || modal === "create") && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold text-zinc-100">
                {modal === "create" ? "New Article" : "Edit Article"}
              </h2>
              <button onClick={closeModal} className="text-zinc-500 hover:text-zinc-300 transition text-xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <FormField label="Title" required>
                <input
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className={inputCls}
                />
              </FormField>
              {modal === "create" && (
                <FormField label="Slug" required>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    placeholder="my-article-slug"
                    className={inputCls}
                  />
                </FormField>
              )}
              <FormField label="Subtitle">
                <input
                  value={form.subtitle ?? ""}
                  onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  className={inputCls}
                />
              </FormField>
              <FormField label="Excerpt" required>
                <textarea
                  rows={2}
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className={inputCls + " resize-none"}
                />
              </FormField>
              <FormField label="Body">
                <RichEditor
                  value={form.body ?? ""}
                  onChange={(html) => setForm((f) => ({ ...f, body: html }))}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Category" required>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className={inputCls}
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </FormField>
                <FormField label="Author" required>
                  <select
                    value={form.authorId}
                    onChange={(e) => setForm({ ...form, authorId: Number(e.target.value) })}
                    className={inputCls}
                  >
                    {AUTHORS.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                  </select>
                </FormField>
              </div>
              <FormField label="Cover Image" required>
                <ImagePicker
                  value={form.imageUrl}
                  onChange={(url) => setForm((f) => ({ ...f, imageUrl: url }))}
                />
              </FormField>
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Read Time (minutes)">
                  <input
                    type="number"
                    min={1}
                    value={form.readTime}
                    onChange={(e) => setForm({ ...form, readTime: Number(e.target.value) })}
                    className={inputCls}
                  />
                </FormField>
                <FormField label="Tags (comma-separated)">
                  <input
                    value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
                    onChange={(e) =>
                      setForm({ ...form, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                    }
                    placeholder="AI, Tech, Privacy"
                    className={inputCls}
                  />
                </FormField>
              </div>
              <div className="flex items-center gap-6 pt-1">
                <Toggle label="Published" checked={form.published} onChange={(v) => setForm({ ...form, published: v })} color="emerald" />
                <Toggle label="Featured" checked={form.featured} onChange={(v) => setForm({ ...form, featured: v })} color="amber" />
                <Toggle label="Editor's Pick" checked={form.editorsPick} onChange={(v) => setForm({ ...form, editorsPick: v })} color="violet" />
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800">
              <p className="text-xs text-zinc-600">Saves commit to GitHub → Vercel deploys in ~60s</p>
              <div className="flex items-center gap-3">
                <button onClick={closeModal} className="text-sm text-zinc-400 hover:text-zinc-200 transition px-4 py-2 rounded-lg hover:bg-zinc-800">
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-semibold text-sm px-6 py-2 rounded-lg transition"
                >
                  {saving ? "Saving to GitHub…" : modal === "create" ? "Create Article" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {modal === "delete" && deleteTarget && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-6 shadow-2xl space-y-4">
            <h2 className="font-semibold text-zinc-100">Delete Article</h2>
            <p className="text-sm text-zinc-400">
              Are you sure you want to delete{" "}
              <span className="text-zinc-200 font-medium">"{deleteTarget.title}"</span>?
              This will commit a deletion to GitHub. It cannot be undone easily.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={closeModal} className="text-sm text-zinc-400 hover:text-zinc-200 transition px-4 py-2 rounded-lg hover:bg-zinc-800">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold text-sm px-5 py-2 rounded-lg transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const inputId = useId();
  const [uploading, setUploading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [urlInput, setUrlInput] = useState(value);

  useEffect(() => { setUrlInput(value); }, [value]);

  async function handleFile(file: File) {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token") ?? ""}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
        setUrlInput(data.url);
      }
    } finally {
      setUploading(false);
      setShowOverlay(false);
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div
          className="relative rounded-lg overflow-hidden aspect-video w-full bg-zinc-800 cursor-pointer group"
          onClick={() => setShowOverlay((v) => !v)}
        >
          <img
            src={value}
            alt=""
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div
            className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 transition-opacity ${
              showOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <p className="text-xs text-zinc-300 font-medium tracking-wide uppercase mb-1">Cover Image</p>
            <div className="flex gap-3">
              <label
                htmlFor={inputId}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1.5 bg-white text-zinc-900 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-zinc-100 transition cursor-pointer"
              >
                {uploading ? (
                  <span className="w-4 h-4 border-2 border-zinc-400 border-t-zinc-900 rounded-full animate-spin inline-block" />
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                )}
                {uploading ? "Uploading…" : "Replace"}
              </label>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange(""); setUrlInput(""); setShowOverlay(false); }}
                className="flex items-center gap-1.5 bg-red-600 text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-red-500 transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          className={`w-full aspect-video rounded-lg border-2 border-dashed border-zinc-700 bg-zinc-800/50 hover:border-primary/60 hover:bg-zinc-800 transition flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-zinc-300 cursor-pointer ${uploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {uploading ? (
            <>
              <span className="w-6 h-6 border-2 border-zinc-600 border-t-primary rounded-full animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span className="text-sm font-medium">Tap to upload image</span>
              <span className="text-xs">from your camera roll or files</span>
            </>
          )}
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <div className="space-y-1">
        <p className="text-xs text-zinc-500">Or paste an image URL</p>
        <input
          value={urlInput}
          onChange={(e) => { setUrlInput(e.target.value); onChange(e.target.value); }}
          placeholder="https://images.unsplash.com/…"
          className={inputCls}
        />
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition";

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-xs font-medium text-zinc-400">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  color,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  color: "emerald" | "amber" | "violet";
}) {
  const colors = {
    emerald: { on: "bg-emerald-600", text: "text-emerald-400" },
    amber: { on: "bg-amber-500", text: "text-amber-400" },
    violet: { on: "bg-violet-600", text: "text-violet-400" },
  };
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-9 h-5 rounded-full transition-colors ${checked ? colors[color].on : "bg-zinc-700"}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
      <span className={`text-sm ${checked ? colors[color].text : "text-zinc-500"}`}>{label}</span>
    </label>
  );
}
