"use client";

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Link as LinkIcon,
  List,
  ListOrdered,
  Type,
} from "lucide-react";

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
import { Textarea } from "@/components/ui/textarea";

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
  const [contentView, setContentView] = useState<"edit" | "preview">("edit");
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

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

    const payload: Record<string, unknown> = {
      title: form.title,
      slug: form.slug,
      content: form.content,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };
    
    if (coverImage) {
      payload.coverImage = coverImage;
    }

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
      let errorText = "Gagal menyimpan blog.";
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

  const insertTextAtCursor = (before: string, after: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = form.content.substring(start, end);
    const newText =
      form.content.substring(0, start) +
      before +
      selectedText +
      after +
      form.content.substring(end);
    
    setForm((f) => ({ ...f, content: newText }));
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const insertLine = (text: string) => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = form.content.substring(0, start).lastIndexOf("\n") + 1;
    const lineEnd = form.content.indexOf("\n", start);
    const lineEndPos = lineEnd === -1 ? form.content.length : lineEnd;
    const currentLineText = form.content.substring(lineStart, lineEndPos);
    
    const newText =
      form.content.substring(0, lineStart) +
      text +
      currentLineText +
      form.content.substring(lineEndPos);
    
    setForm((f) => ({ ...f, content: newText }));
    
    setTimeout(() => {
      textarea.focus();
      const newPosition = lineStart + text.length + currentLineText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl">{editingSlug ? "Perbarui Artikel" : "Blog Baru"}</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Bagikan insight baru atau dokumentasikan proses yang sedang Anda kerjakan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Judul</Label>
                <Input
                  id="title"
                  placeholder="Masukkan judul artikel"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  placeholder="slug-artikel"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Label htmlFor="content">Konten</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={contentView === "edit" ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setContentView("edit")}
                  >
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant={contentView === "preview" ? "default" : "outline"}
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setContentView("preview")}
                  >
                    Preview
                  </Button>
                </div>
              </div>
              {contentView === "edit" ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1 overflow-x-auto rounded-t-lg border border-b-0 border-slate-200 bg-slate-50 p-2 scrollbar-hide">
                    <Select
                      onValueChange={(value) => {
                        if (value === "h1") insertLine("# ");
                        else if (value === "h2") insertLine("## ");
                        else if (value === "h3") insertLine("### ");
                        else if (value === "p") insertLine("");
                      }}
                    >
                      <SelectTrigger className="h-8 w-[100px] gap-1 sm:w-[120px] cursor-pointer">
                        <Type className="h-4 w-4" />
                        <SelectValue className="cursor-pointer" placeholder="Paragraph" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem className="cursor-pointer" value="h1">
                          <div className="flex items-center gap-2">
                            <Heading1 className="h-4 w-4" />
                            Heading 1
                          </div>
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="h2">
                          <div className="flex items-center gap-2">
                            <Heading2 className="h-4 w-4" />
                            Heading 2
                          </div>
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="h3">
                          <div className="flex items-center gap-2">
                            <Heading3 className="h-4 w-4" />
                            Heading 3
                          </div>
                        </SelectItem>
                        <SelectItem className="cursor-pointer" value="p">Paragraph</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="h-4 w-px bg-slate-300" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 cursor-pointer"
                      onClick={() => insertTextAtCursor("**", "**")}
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-px bg-slate-300" />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 cursor-pointer"
                      onClick={() => insertLine("- ")}
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 cursor-pointer"
                      onClick={() => insertLine("1. ")}
                      title="Numbered List"
                    >
                      <ListOrdered className="h-4 w-4" />
                    </Button>
                    <div className="h-4 w-px bg-slate-300" />
                  </div>
                  <Textarea
                    ref={contentTextareaRef}
                    id="content"
                    rows={12}
                    placeholder="Konten markdown / rich text&#10;&#10;Contoh:&#10;# Judul&#10;&#10;Paragraf dengan **teks tebal** dan *teks miring*.&#10;&#10;- List item 1&#10;- List item 2"
                    value={form.content}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, content: e.target.value }))
                    }
                    className="font-mono text-sm rounded-t-none"
                    required
                  />
                </div>
              ) : (
                <div className="min-h-[300px] rounded-lg border border-slate-200 bg-white p-6">
                  {form.content ? (
                    <div className="markdown-preview">
                      <ReactMarkdown>{form.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400">
                      Tulis konten di tab Edit untuk melihat preview di sini.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (pisahkan dengan koma)</Label>
              <Input
                id="tags"
                placeholder="Next.js, MongoDB, UI/UX"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
              />
            </div>

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
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, coverImage: "" }))}
                  >
                    Hapus cover
                  </Button>
                )}
              </div>
              <Label className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-6 text-sm font-medium text-slate-600 transition hover:border-blue-300 hover:bg-blue-50">
                <span>{coverFile ? "Ganti cover" : "Upload cover"}</span>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    setCoverFile(file ?? null);
                  }}
                />
                <span className="text-xs text-slate-400">
                  Disarankan 1200×600px
                </span>
              </Label>
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

            <Button
              type="submit"
              disabled={loading || uploadingCover}
              className="w-full cursor-pointer md:w-auto"
            >
              {uploadingCover
                ? "Mengunggah cover..."
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
        {blogs.map((blog) => (
          <Card
            key={blog._id}
            className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
          >
            <CardContent className="p-4 sm:p-6">
              <p className="font-semibold text-sm sm:text-base">{blog.title}</p>
              <p className="text-xs text-slate-500 sm:text-sm">{blog.slug}</p>
            </CardContent>
            <CardContent className="flex gap-2 p-4 pb-4 sm:gap-3 sm:pb-6 md:pb-0 md:pr-6">
              <Button variant="ghost" className="cursor-pointer" size="sm" onClick={() => handleEdit(blog)}>
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(blog.slug)}
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

