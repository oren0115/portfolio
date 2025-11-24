"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";

type Project = {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  image?: string | null;
  link_demo?: string | null;
  link_repo?: string | null;
};

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  image: "",
  link_demo: "",
  link_repo: "",
};

type Props = {
  initialProjects: Project[];
};

type ToastState = {
  kind: "success" | "error";
  text: string;
} | null;

export default function ProjectsManager({ initialProjects }: Props) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (res.ok) {
      setProjects(await res.json());
    }
  };

  const uploadImageFile = async (file: File) => {
    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        setToast({ kind: "error", text: "Upload gambar gagal." });
        return null;
      }
      const data = (await uploadResponse.json()) as { url: string };
      return data.url;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    let imageUrl = form.image.trim();
    if (imageFile) {
      const uploadedUrl = await uploadImageFile(imageFile);
      if (!uploadedUrl) {
        setLoading(false);
        return;
      }
      imageUrl = uploadedUrl;
    }

    const payload = {
      ...form,
      image: imageUrl,
      techStack: form.techStack
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch(
      editingId ? `/api/projects/${editingId}` : "/api/projects",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);
    if (!response.ok) {
      let errorText = "Gagal menyimpan project.";
      try {
        const data = await response.json();
        if (typeof data?.error === "string") {
          errorText = data.error;
        } else if (data?.error?.fieldErrors) {
          const firstField = Object.entries(
            data.error.fieldErrors as Record<string, string[]>
          )[0];
          if (firstField?.[1]?.length) {
            errorText = `${firstField[0]}: ${firstField[1][0]}`;
          }
        }
      } catch {
        // ignore parse error
      }
      setToast({ kind: "error", text: errorText });
      return;
    }

    setToast({
      kind: "success",
      text: editingId ? "Project berhasil diperbarui." : "Project baru tersimpan!",
    });
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    fetchProjects();
  };

  const handleEdit = (project: Project) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: (project.techStack ?? []).join(", "),
      image: project.image ?? "",
      link_demo: project.link_demo ?? "",
      link_repo: project.link_repo ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus project ini?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProjects();
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
              {editingId ? "Edit Mode" : "Project Baru"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {editingId ? "Perbarui Project" : "Tambah Project"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              className="text-sm text-slate-500 underline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Batalkan edit
            </button>
          )}
        </div>
        <div className="space-y-4">
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Nama Project</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Masukkan nama project"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              minLength={3}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Deskripsi</span>
            <textarea
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Ceritakan highlight project (minimal 10 karakter)"
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              minLength={10}
              required
            />
          </label>
          <label className="block space-y-2 text-sm font-medium text-slate-700">
            <span>Tech Stack (pisahkan dengan koma)</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Typescript, React, Tailwind..."
              value={form.techStack}
              onChange={(e) =>
                setForm((f) => ({ ...f, techStack: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Demo URL</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="https://demo-anda.com"
              value={form.link_demo}
              onChange={(e) =>
                setForm((f) => ({ ...f, link_demo: e.target.value }))
              }
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Repository URL</span>
            <input
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="https://github.com/username/project"
              value={form.link_repo}
              onChange={(e) =>
                setForm((f) => ({ ...f, link_repo: e.target.value }))
              }
            />
          </label>
        </div>

        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Gambar Project
              </p>
              <p className="text-xs text-slate-500">
                Upload file untuk menampilkan preview project.
              </p>
            </div>
            {form.image && !imageFile && (
              <button
                type="button"
                className="text-xs font-semibold text-red-500 underline"
                onClick={() => setForm((f) => ({ ...f, image: "" }))}
              >
                Hapus gambar
              </button>
            )}
          </div>
          <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
            <span>{imageFile ? "Ganti gambar" : "Pilih gambar"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                setImageFile(file ?? null);
              }}
            />
            <span className="text-xs text-slate-400">
              Format JPG, PNG, atau WEBP
            </span>
          </label>
          {(imageFile || form.image) && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Preview</p>
              <div className="relative mt-2 h-48 w-full overflow-hidden rounded-lg">
                <Image
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : (form.image ?? "")
                  }
                  alt="Preview project"
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
          disabled={loading || uploadingImage}
        >
          {uploadingImage
            ? "Mengunggah gambar..."
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
        {projects.map((project) => (
          <div
            key={project._id}
            className="card flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">{project.title}</p>
              <p className="text-sm text-slate-500">
                {(project.techStack ?? []).join(", ")}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                className="text-blue-600 cursor-pointer hover:text-blue-700 underline"
                onClick={() => handleEdit(project)}
              >
                Edit
              </button>
              <button
                className="text-red-600 cursor-pointer hover:text-red-700 underline"
                onClick={() => handleDelete(project._id)}
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

