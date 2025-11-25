"use client";

import { FormEvent, useState } from "react";

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

export default function ExperienceManager({ initialExperiences }: Props) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    text: string;
  } | null>(null);

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

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <CardTitle>
              {editingId ? "Perbarui Timeline" : "Tambah Pengalaman"}
            </CardTitle>
            <CardDescription>
              {editingId
                ? "Ubah data pengalaman kemudian simpan untuk memperbarui."
                : "Isi detail pengalaman profesional, lalu simpan."}
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="company">Perusahaan</Label>
                <Input
                  id="company"
                  placeholder="Nama perusahaan / organisasi"
                  value={form.company}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, company: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="Posisi atau tanggung jawab utama"
                  value={form.role}
                  onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Tanggal Mulai</Label>
                <Input
                  id="startDate"
                  placeholder="Contoh: Jan 2023"
                  value={form.startDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, startDate: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">Tanggal Selesai / Present</Label>
                <Input
                  id="endDate"
                  placeholder="Contoh: Des 2024 atau kosongkan"
                  value={form.endDate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Singkat</Label>
              <Textarea
                id="description"
                rows={3}
                placeholder="Ceritakan kontribusi utama dan hasil yang dicapai."
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="highlights">Highlights (satu per baris)</Label>
              <Textarea
                id="highlights"
                rows={3}
                placeholder="Contoh:\n- Memimpin tim 5 orang\n- Meningkatkan konversi 30%"
                value={form.highlights}
                onChange={(e) =>
                  setForm((f) => ({ ...f, highlights: e.target.value }))
                }
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full cursor-pointer md:w-auto">
              {loading ? "Menyimpan..." : "Simpan"}
            </Button>
            {toast && (
              <Alert
                variant={toast.kind === "success" ? "default" : "destructive"}
              >
                <AlertDescription>{toast.text}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {experiences.map((exp) => (
          <Card
            key={exp._id}
            className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <CardContent className="flex flex-col gap-1 p-6">
              <p className="font-semibold">
                {exp.role} – {exp.company}
              </p>
              <p className="text-sm text-slate-500">
                {exp.startDate} — {exp.endDate ?? "Present"}
              </p>
            </CardContent>
            <CardContent className="flex gap-3 pb-6 md:pb-0 md:pr-6">
              <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => handleEdit(exp)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(exp._id)}
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
