"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { IProject } from "@/models/Project";
import type { WithId } from "@/types/content";

type Props = {
  initialProjects: WithId<IProject>[];
};

const emptyForm = {
  title: "",
  description: "",
  techStack: "",
  image: "",
  link_demo: "",
  link_repo: "",
};

type ToastState = { kind: "success" | "error"; text: string } | null;

export default function ProjectsManager({ initialProjects }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [toast, setToast] = useState<ToastState>(null);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects", { cache: "no-store" });
    if (res.ok) {
      setProjects(await res.json());
    }
  };

  const uploadImage = async (file: File) => {
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

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setToast(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    let imageUrl = form.image.trim();
    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      imageUrl = uploaded;
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
      let message = "Gagal menyimpan project.";
      try {
        const data = await response.json();
        if (typeof data?.error === "string") {
          message = data.error;
        } else if (data?.error?.fieldErrors) {
          const first = Object.entries(
            data.error.fieldErrors as Record<string, string[]>
          )[0];
          if (first?.[1]?.length) {
            message = `${first[0]}: ${first[1][0]}`;
          }
        }
      } catch {
        // ignore
      }
      setToast({ kind: "error", text: message });
      return;
    }

    setToast({
      kind: "success",
      text: editingId ? "Project diperbarui." : "Project baru tersimpan.",
    });
    resetForm();
    fetchProjects();
  };

  const handleEdit = (project: WithId<IProject>) => {
    setEditingId(project._id);
    setForm({
      title: project.title,
      description: project.description,
      techStack: (project.techStack ?? []).join(", "),
      image: project.image ?? "",
      link_demo: project.link_demo ?? "",
      link_repo: project.link_repo ?? "",
    });
    setImageFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus project ini?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchProjects();
    }
  };

  const imagePreview = useMemo(() => {
    if (imageFile) return URL.createObjectURL(imageFile);
    return form.image.trim();
  }, [imageFile, form.image]);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>{editingId ? "Perbarui Project" : "Project Baru"}</CardTitle>
            <CardDescription>
              {editingId
                ? "Ubah data project kemudian simpan untuk memperbarui."
                : "Isi detail project baru, unggah gambar opsional, lalu simpan."}
            </CardDescription>
          </div>
          {editingId && (
            <Button variant="ghost" className="cursor-pointer" size="sm" onClick={resetForm}>
              Batalkan edit
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nama Project</Label>
                <Input
                  id="title"
                  placeholder="Masukkan nama project"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  minLength={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  rows={4}
                  placeholder="Ceritakan highlight project"
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  minLength={10}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech">Tech Stack (pisahkan dengan koma)</Label>
                <Input
                  id="tech"
                  placeholder="Typescript, React, Tailwind..."
                  value={form.techStack}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, techStack: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  placeholder="https://demo-anda.com"
                  value={form.link_demo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link_demo: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repo">Repository URL</Label>
                <Input
                  id="repo"
                  placeholder="https://github.com/username/project"
                  value={form.link_repo}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link_repo: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Gambar Project
                  </p>
                  <p className="text-xs text-slate-500">
                    Upload file atau gunakan URL yang tersedia.
                  </p>
                </div>
                {form.image && !imageFile && (
                  <Button
                    type="button"
                    className="cursor-pointer"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        image: "",
                      }))
                    }
                  >
                    Hapus gambar
                  </Button>
                )}
              </div>
              <Label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
                <span>{imageFile ? "Ganti gambar" : "Upload gambar"}</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setImageFile(file ?? null);
                  }}
                />
                <span className="text-xs text-slate-400">
                  Format JPG, PNG, atau WEBP
                </span>
              </Label>
              {imagePreview && (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-600">Preview</p>
                  <div className="relative mt-2 h-48 w-full overflow-hidden rounded-lg">
                    <Image
                      src={imagePreview}
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

            <Button
              type="submit"

              className="w-full cursor-pointer md:w-auto"
              disabled={loading || uploadingImage}
            >
              {uploadingImage
                ? "Mengunggah gambar..."
                : loading
                  ? "Menyimpan..."
                  : "Simpan"}
            </Button>

            {toast && (
              <Alert variant={toast.kind === "success" ? "default" : "destructive"}>
                <AlertDescription>{toast.text}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {projects.map((project) => (
          <Card
            key={project._id}
            className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <CardContent className="flex flex-col gap-1 p-4 sm:p-6">
              <p className="font-semibold text-sm sm:text-base">{project.title}</p>
              <p className="text-xs text-slate-500 sm:text-sm">
                {(project.techStack ?? []).join(", ")}
              </p>
            </CardContent>
            <CardContent className="flex gap-2 p-4 pb-4 sm:gap-3 sm:pb-6 md:pb-0 md:pr-6">
              <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => handleEdit(project)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(project._id)}
                className="cursor-pointer"
              >
                Hapus
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

