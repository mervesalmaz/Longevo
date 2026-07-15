"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import type { Article, ArticleCategory } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories: ArticleCategory[] = ["Rehber", "Bilimsel", "Röportaj"];

const categoryColors: Record<string, string> = {
  Rehber: "bg-green-50 text-green-700",
  Bilimsel: "bg-blue-50 text-blue-700",
  Röportaj: "bg-amber-50 text-amber-700",
};

const TR_MONTHS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return `${d.getDate()} ${TR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const emptyForm = {
  title: "",
  slug: "",
  category: "Rehber" as ArticleCategory,
  excerpt: "",
  content: "",
  reading_time: "",
  author: "",
  cover_image: "",
  featured: false,
  published: false,
};

type FormState = typeof emptyForm;

export default function ArticlesAdmin() {
  const supabase = createClient();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });
    setArticles((data ?? []) as Article[]);
    setLoading(false);
  };

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.slug.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setSlugTouched(false);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (a: Article) => {
    setEditingId(a.id);
    setSlugTouched(true);
    setForm({
      title: a.title,
      slug: a.slug,
      category: a.category,
      excerpt: a.excerpt ?? "",
      content: a.content ?? "",
      reading_time: a.reading_time != null ? String(a.reading_time) : "",
      author: a.author ?? "",
      cover_image: a.cover_image ?? "",
      featured: a.featured,
      published: a.published,
    });
    setDialogOpen(true);
  };

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const existing = editingId
      ? articles.find((a) => a.id === editingId)
      : undefined;

    // Set published_at the first time an article becomes published.
    let publishedAt = existing?.published_at ?? null;
    if (form.published && !publishedAt) {
      publishedAt = new Date().toISOString();
    }
    if (!form.published) {
      publishedAt = null;
    }

    const payload = {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      category: form.category,
      excerpt: form.excerpt.trim() || null,
      content: form.content.trim() || null,
      reading_time: form.reading_time
        ? parseInt(form.reading_time, 10)
        : null,
      author: form.author.trim() || null,
      cover_image: form.cover_image.trim() || null,
      featured: form.featured,
      published: form.published,
      published_at: publishedAt,
    };

    if (editingId) {
      await supabase.from("articles").update(payload).eq("id", editingId);
    } else {
      await supabase.from("articles").insert(payload);
    }

    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("articles").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchData();
  };

  const publishedCount = articles.filter((a) => a.published).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Blog</h1>
          <p className="text-gray-500 text-sm">
            {articles.length} makale · {publishedCount} yayında
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Yeni Makale
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Makale ara..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Başlık</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="hidden md:table-cell">Durum</TableHead>
              <TableHead className="hidden md:table-cell">Tarih</TableHead>
              <TableHead className="text-right">İşlemler</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={5}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-12 text-gray-500">
                  {search
                    ? "Aramanızla eşleşen makale yok."
                    : "Henüz makale yok. İlk makaleyi ekleyin."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((a) => (
                <TableRow key={a.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      {a.featured && (
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mt-1 shrink-0" />
                      )}
                      <div>
                        <div className="font-medium">{a.title}</div>
                        <div className="text-xs text-gray-500">/{a.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={categoryColors[a.category] ?? categoryColors.Rehber}
                    >
                      {a.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {a.published ? (
                      <Badge className="bg-green-600 text-white">Yayında</Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                        Taslak
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-600">
                    {fmtDate(a.published_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {a.published && (
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Sitede görüntüle"
                          asChild
                        >
                          <a
                            href={`/tr/rehber/${a.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(a)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(a.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white">
            <DialogTitle>
              {editingId ? "Makaleyi Düzenle" : "Yeni Makale"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="article-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            <div>
              <Label>Başlık *</Label>
              <Input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                placeholder="örn. NAD+ IV Terapisi: Bilimsel Rehber"
              />
            </div>
            <div>
              <Label>URL Slug *</Label>
              <Input
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setForm({ ...form, slug: e.target.value });
                }}
                required
                placeholder="nad-iv-terapisi-rehber"
              />
              <p className="text-xs text-gray-500 mt-1">
                Adres: /tr/rehber/{form.slug || "..."}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Kategori *</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) =>
                    setForm({ ...form, category: val as ArticleCategory })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Okuma Süresi (dk)</Label>
                <Input
                  type="number"
                  min="1"
                  value={form.reading_time}
                  onChange={(e) =>
                    setForm({ ...form, reading_time: e.target.value })
                  }
                  placeholder="örn. 8"
                />
              </div>
            </div>
            <div>
              <Label>Yazar</Label>
              <Input
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="örn. Dr. Ayşe Yılmaz"
              />
            </div>
            <div>
              <Label>Kapak Görseli (URL)</Label>
              <Input
                value={form.cover_image}
                onChange={(e) =>
                  setForm({ ...form, cover_image: e.target.value })
                }
                placeholder="https://..."
              />
            </div>
            <div>
              <Label>Özet</Label>
              <Textarea
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                rows={2}
                placeholder="Kart ve önizlemelerde görünen kısa açıklama."
              />
            </div>
            <div>
              <Label>İçerik (markdown)</Label>
              <Textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                placeholder="Makalenin tam metni. Satır boşlukları korunur."
                className="font-mono text-sm"
              />
            </div>
            <div className="flex flex-col gap-3 pt-2 border-t">
              <div className="flex items-center justify-between pt-2">
                <div>
                  <Label className="mb-0">Yayında</Label>
                  <p className="text-xs text-gray-500">
                    Açık olduğunda sitede herkese görünür.
                  </p>
                </div>
                <Switch
                  checked={form.published}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, published: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="mb-0">Öne çıkar</Label>
                  <p className="text-xs text-gray-500">
                    Ana sayfa editoryal bölümünde gösterilir (en fazla 3).
                  </p>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, featured: checked })
                  }
                />
              </div>
            </div>
          </form>
          <div className="px-6 py-4 border-t shrink-0 bg-white">
            <Button
              form="article-form"
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving
                ? "Kaydediliyor..."
                : editingId
                ? "Makaleyi Güncelle"
                : "Makale Ekle"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Makaleyi Sil</AlertDialogTitle>
            <AlertDialogDescription>
              Bu makale kalıcı olarak silinecek. Bu işlem geri alınamaz.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>İptal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Sil
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
