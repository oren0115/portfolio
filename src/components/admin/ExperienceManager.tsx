"use client";

import { FormEvent, useState } from "react";

type Experience = {
  _id: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  description: string;
  highlights: string[];
};

const emptyForm = {
  company: "",
  role: "",
  startDate: "",
  endDate: "",
  description: "",
  highlights: "",
};

type Props = {
  initialExperiences: Experience[];
};

type ToastState = {
  kind: "success" | "error";
  text: string;
} | null;

export default function ExperienceManager({ initialExperiences }: Props) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const fetchExperiences = async () => {
    const res = await fetch("/api/experience", { cache: "no-store" });
    if (res.ok) {
      setExperiences(await res.json());
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setToast(null);

    const payload = {
      ...form,
      highlights: form.highlights
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      endDate: form.endDate || "present",
    };

    const response = await fetch(
      editingId ? `/api/experience/${editingId}` : "/api/experience",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    setLoading(false);
    if (!response.ok) {
      setToast({ kind: "error", text: "Gagal menyimpan experience." });
      return;
    }
    setToast({
      kind: "success",
      text: editingId ? "Experience diperbarui." : "Experience baru ditambahkan.",
    });
    setForm(emptyForm);
    setEditingId(null);
    fetchExperiences();
  };

  const handleEdit = (exp: Experience) => {
    setEditingId(exp._id);
    setForm({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate ?? "",
      description: exp.description,
      highlights: (exp.highlights ?? []).join("\n"),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus pengalaman ini?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchExperiences();
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
              {editingId ? "Edit Mode" : "Experience Baru"}
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              {editingId ? "Perbarui Timeline" : "Tambah Pengalaman"}
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
              Batalkan
            </button>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Perusahaan</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Nama perusahaan / organisasi"
              value={form.company}
              onChange={(e) =>
                setForm((f) => ({ ...f, company: e.target.value }))
              }
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Role</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Posisi atau tanggung jawab utama"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              required
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Tanggal Mulai</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Contoh: Jan 2023"
              value={form.startDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, startDate: e.target.value }))
              }
              required
            />
          </label>
          <label className="space-y-2 text-sm font-medium text-slate-700">
            <span>Tanggal Selesai / Present</span>
            <input
              className="rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
              placeholder="Contoh: Des 2024 atau kosongkan"
              value={form.endDate}
              onChange={(e) =>
                setForm((f) => ({ ...f, endDate: e.target.value }))
              }
            />
          </label>
        </div>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Deskripsi Singkat</span>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
            placeholder="Ceritakan kontribusi utama dan hasil yang dicapai."
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            required
          />
        </label>
        <label className="block space-y-2 text-sm font-medium text-slate-700">
          <span>Highlights (satu per baris)</span>
          <textarea
            className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            rows={3}
            placeholder={"Contoh:\n- Memimpin tim 5 orang\n- Meningkatkan konversi 30%"}
            value={form.highlights}
            onChange={(e) =>
              setForm((f) => ({ ...f, highlights: e.target.value }))
            }
          />
        </label>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Menyimpan..." : "Simpan"}
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
        {experiences.map((exp) => (
          <div
            key={exp._id}
            className="card flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-semibold">
                {exp.role} – {exp.company}
              </p>
              <p className="text-sm text-slate-500">
                {exp.startDate} — {exp.endDate ?? "Present"}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              <button
                className="text-brand-accent underline"
                onClick={() => handleEdit(exp)}
              >
                Edit
              </button>
              <button
                className="text-red-500 underline"
                onClick={() => handleDelete(exp._id)}
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

