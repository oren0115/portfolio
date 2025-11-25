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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Skill = {
  _id: string;
  name: string;
  level: "beginner" | "intermediate" | "expert";
  category: "frontend" | "backend" | "jaringan" | "database";
  icon?: string | null;
};

const emptyForm = {
  name: "",
  level: "beginner" as Skill["level"],
  category: "frontend" as Skill["category"],
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
      category: form.category,
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
      category: skill.category,
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
      <Card>
        <CardHeader>
          <CardTitle>{editingId ? "Perbarui Skill" : "Skill Baru"}</CardTitle>
          <CardDescription>
            Tambahkan kemampuan utama yang mencerminkan kekuatan profil Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Skill</Label>
              <Input
                id="name"
                placeholder="Contoh: Next.js, UI/UX, Product Strategy"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={form.category}
                  onValueChange={(value: Skill["category"]) =>
                    setForm((f) => ({ ...f, category: value }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="jaringan">Jaringan</SelectItem>
                    <SelectItem value="database">Database</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Tingkat Kemahiran</Label>
                <Select
                  value={form.level}
                  onValueChange={(value: Skill["level"]) =>
                    setForm((f) => ({ ...f, level: value }))
                  }
                >
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Pilih level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-dashed border-slate-300 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Ikon Skill (opsional)
                  </p>
                  <p className="text-xs text-slate-500">
                    Upload ikon kustom atau gunakan emoji sederhana.
                  </p>
                </div>
                {form.icon && !iconFile && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, icon: "" }))}
                  >
                    Hapus ikon
                  </Button>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
                  <span>{iconFile ? "Ganti ikon" : "Upload ikon"}</span>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      setIconFile(file ?? null);
                    }}
                  />
                  <span className="text-xs text-slate-400">
                    PNG / SVG dengan latar transparan
                  </span>
                </Label>
                <div className="space-y-2">
                  <Label htmlFor="emoji">Emoji (opsional)</Label>
                  <Input
                    id="emoji"
                    placeholder="🚀"
                    value={form.icon}
                    onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  />
                  <p className="text-xs text-slate-400">
                    Diisi jika ingin memakai emoji sederhana.
                  </p>
                </div>
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

            <Button
              type="submit"
              disabled={loading || uploadingIcon}
              className="w-full md:w-auto"
            >
              {uploadingIcon
                ? "Mengunggah ikon..."
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

      <div className="grid gap-4 md:grid-cols-2">
        {skills.map((skill) => (
          <Card
            key={skill._id}
            className="flex items-center justify-between px-4 py-3"
          >
            <CardContent className="flex items-center gap-3 p-0">
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
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-blue-600">
                    {skill.category === "frontend" && "Frontend"}
                    {skill.category === "backend" && "Backend"}
                    {skill.category === "jaringan" && "Jaringan"}
                    {skill.category === "database" && "Database"}
                  </p>
                  <span className="text-slate-300">•</span>
                  <p className="text-xs uppercase text-slate-500">
                    {skill.level}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardContent className="flex gap-3 p-0">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(skill)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(skill._id)}
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
