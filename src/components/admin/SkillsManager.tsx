"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";

type Skill = {
  _id: string;
  name: string;
  level: "beginner" | "intermediate" | "expert";
  icon?: string | null;
};

const emptyForm = {
  name: "",
  level: "beginner" as Skill["level"],
  icon: "",
};

type Props = {
  initialSkills: Skill[];
};

export default function SkillsManager({ initialSkills }: Props) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ kind: "success" | "error"; text: string } | null>(null);
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);

  const fetchSkills = async () => {
    const res = await fetch("/api/skills", { cache: "no-store" });
    if (res.ok) {
      setSkills(await res.json());
    }
  };

  const uploadIcon = async (file: File) => {
    setUploadingIcon(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const uploadResponse = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      if (!uploadResponse.ok) {
        setToast({ kind: "error", text: "Upload ikon gagal." });
        return null;
      }
      const data = (await uploadResponse.json()) as { url: string };
      return data.url;
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    let iconValue = form.icon.trim();
    if (iconFile) {
      const uploaded = await uploadIcon(iconFile);
      if (!uploaded) {
        setLoading(false);
        return;
      }
      iconValue = uploaded;
    }

    const payload = {
      name: form.name,
      level: form.level,
      icon: iconValue,
    };

    const response = await fetch(
      editingId ? `/api/skills/${editingId}` : "/api/skills",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    setLoading(false);
    if (!response.ok) {
      setToast({ kind: "error", text: "Gagal menyimpan skill." });
      return;
    }
    setToast({
      kind: "success",
      text: editingId ? "Skill diperbarui." : "Skill baru ditambahkan.",
    });
    setForm(emptyForm);
    setIconFile(null);
    setEditingId(null);
    fetchSkills();
  };

  const handleEdit = (skill: Skill) => {
    setEditingId(skill._id);
    setForm({
      name: skill.name,
      level: skill.level,
      icon: skill.icon ?? "",
    });
    setIconFile(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus skill ini?")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchSkills();
    }
  };

  const iconPreviewSource = useMemo(() => {
    if (iconFile) return { type: "image" as const, src: URL.createObjectURL(iconFile) };
    if (form.icon && /^https?:/i.test(form.icon)) {
      return { type: "image" as const, src: form.icon };
    }
    if (form.icon) {
      return { type: "emoji" as const, value: form.icon };
    }
    return null;
  }, [iconFile, form.icon]);

  return (
    <div className="space-y-8">
      <form
        className="card space-y-6 rounded-2xl border border-slate-200 p-8 shadow-md"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
              {editingId ? "Edit Mode" : "Skill Baru"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {editingId ? "Perbarui Skill" : "Tambahkan Skill"}
            </h2>
          </div>
          {editingId && (
            <button
              type="button"
              className="text-sm text-slate-500 underline"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setIconFile(null);
              }}
            >
              Batalkan
            </button>
          )}
        </div>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Nama Skill</span>
          <input
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            placeholder="Contoh: Next.js, UI/UX, Product Strategy"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Tingkat Kemahiran</span>
          <select
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={form.level}
            onChange={(e) =>
              setForm((f) => ({ ...f, level: e.target.value as Skill["level"] }))
            }
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="expert">Expert</option>
          </select>
        </label>

        <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Ikon Skill (opsional)
              </p>
              <p className="text-xs text-slate-500">
                Upload ikon kustom atau gunakan emoji.
              </p>
            </div>
            {form.icon && !iconFile && (
              <button
                type="button"
                className="text-xs font-semibold text-red-500 underline"
                onClick={() => setForm((f) => ({ ...f, icon: "" }))}
              >
                Hapus ikon
              </button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
              <span>{iconFile ? "Ganti ikon" : "Upload ikon"}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  setIconFile(file ?? null);
                }}
              />
              <span className="text-xs text-slate-400">
                PNG / SVG dengan latar transparan
              </span>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Emoji (opsional)</span>
              <input
                className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                placeholder="🚀"
                value={form.icon}
                onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
              />
              <span className="text-xs text-slate-400">
                Diisi jika ingin memakai emoji sederhana.
              </span>
            </label>
          </div>
          {iconPreviewSource && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-medium text-slate-600">Preview</p>
              {iconPreviewSource.type === "image" ? (
                <div className="relative mt-2 h-24 w-24 overflow-hidden rounded-lg">
                  <Image
                    src={iconPreviewSource.src}
                    alt="Ikon skill"
                    fill
                    className="object-cover"
                    sizes="96px"
                    unoptimized
                  />
                </div>
              ) : (
                <p className="mt-2 text-4xl">{iconPreviewSource.value}</p>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading || uploadingIcon}
        >
          {uploadingIcon
            ? "Mengunggah ikon..."
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

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="card flex items-center justify-between rounded-2xl border border-slate-200 p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              {skill.icon ? (
                /^https?:/i.test(skill.icon) ? (
                  <div className="relative h-12 w-12 overflow-hidden rounded-full border border-slate-200">
                    <Image
                      src={skill.icon}
                      alt={skill.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <span className="text-3xl">{skill.icon}</span>
                )
              ) : (
                <span className="text-2xl text-slate-300">•</span>
              )}
              <div>
                <p className="font-semibold">{skill.name}</p>
                <p className="text-xs uppercase text-slate-500">
                  {skill.level}
                </p>
              </div>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                className="text-blue-600 underline"
                onClick={() => handleEdit(skill)}
              >
                Edit
              </button>
              <button
                className="text-red-500 underline"
                onClick={() => handleDelete(skill._id)}
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

