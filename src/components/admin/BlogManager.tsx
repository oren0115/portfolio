"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type Blog = {
  _id: string;
  title: string;
  slug: string;
  content: string;
  tags: string[];
  coverImage?: string | null;
};

const emptyForm = {
  title: "",
  slug: "",
  content: "",
  tags: "",
  coverImage: "",
};

type Props = {
  initialBlogs: Blog[];
};

export default function BlogManager({ initialBlogs }: Props) {
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);
  const [form, setForm] = useState(emptyForm);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const fetchBlogs = async () => {
    const res = await fetch("/api/blog", { cache: "no-store" });
    if (res.ok) {
      setBlogs(await res.json());
    }
  };

  const uploadCoverFile = async (file: File) => {
    setUploadingCover(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        setToast({ kind: "error", text: "Upload cover gagal." });
        return null;
      }
      const data = (await uploadResponse.json()) as { url: string };
      return data.url;
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);
    let coverImage = form.coverImage.trim();
    if (coverFile) {
      const uploaded = await uploadCoverFile(coverFile);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      coverImage = uploaded;
    }

    const payload = {
      ...form,
      coverImage,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    const response = await fetch(
      editingSlug ? `/api/blog/${editingSlug}` : "/api/blog",
      {
        method: editingSlug ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);
    if (!response.ok) {
      setToast({ kind: "error", text: "Gagal menyimpan blog." });
      return;
    }

    setToast({
      kind: "success",
      text: editingSlug ? "Blog diperbarui." : "Blog baru dipublikasikan.",
    });
    setForm(emptyForm);
    setCoverFile(null);
    setEditingSlug(null);
    fetchBlogs();
  };

  const handleEdit = (blog: Blog) => {
    setEditingSlug(blog.slug);
    setForm({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      tags: (blog.tags ?? []).join(", "),
      coverImage: blog.coverImage ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Hapus blog ini?")) return;
    const res = await fetch(`/api/blog/${slug}`, { method: "DELETE" });
    if (res.ok) {
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-8">
      <form
        className="card space-y-6 rounded-2xl border border-slate-200 p-8 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              {editingSlug ? "Edit Mode" : "Blog Baru"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {editingSlug ? "Perbarui Artikel" : "Tulis Artikel"}
            </h2>
          </div>
          {editingSlug && (
            <button
              type="button"
              className="text-sm text-slate-500 underline"
              onClick={() => {
                setEditingSlug(null);
                setForm(emptyForm);
              }}
            >
              Batalkan edit
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Judul</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan judul artikel"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Slug</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="slug-artikel"
              value={form.slug}
              onChange={(e) =>
                setForm((f) => ({ ...f, slug: e.target.value }))
              }
              required
            />
          </label>
        </div>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Konten</span>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={6}
            placeholder="Konten markdown / rich text"
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Tags (pisahkan dengan koma)</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Next.js, MongoDB, UI/UX"
            value={form.tags}
            onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
          />
        </label>
        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Cover Artikel
              </p>
              <p className="text-xs text-slate-500">
                Unggah gambar untuk halaman detail artikel.
              </p>
            </div>
            {form.coverImage && !coverFile && (
              <button
                type="button"
                className="text-xs font-semibold text-red-500 underline"
                onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
              >
                Hapus cover
              </button>
            )}
          </div>
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
            <span>{coverFile ? "Ganti cover" : "Upload cover"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setCoverFile(file ?? null);
              }}
            />
            <span className="text-xs text-slate-400">
              Resolusi disarankan 1200×600
            </span>
          </label>
          {(coverFile || form.coverImage) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Preview</p>
              <div className="relative mt-2 h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    coverFile
                      ? URL.createObjectURL(coverFile)
                      : (form.coverImage ?? "")
                  }
                  alt="Preview cover"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  unoptimized
                />
              </div>
            </div>
          )}
        </div>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || uploadingCover}
        >
          {uploadingCover
            ? "Mengunggah cover..."
            : loading
              ? "Menyimpan..."
              : "Simpan"}
        </button>
        {toast && (
          <p
            className={`text-sm ${
              toast.kind === "success" ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {toast.text}
          </p>
        )}
      </form>

      <div className="grid gap-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="card flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{blog.title}</p>
              <p className="text-sm text-slate-500">{blog.slug}</p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                className="text-brand-accent underline"
                onClick={() => handleEdit(blog)}
              >
                Edit
              </button>
              <button
                className="text-red-500 underline"
                onClick={() => handleDelete(blog.slug)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

