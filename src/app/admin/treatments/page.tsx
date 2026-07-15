"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import type { Treatment } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const categories = [
  "Infusion",
  "Diagnostics",
  "Regenerative",
  "Recovery",
  "Supplement",
  "Other",
];

const emptyForm = { name: "", category: "", starting_price_try: "" };

export default function TreatmentsAdmin() {
  const supabase = createClient();
  const [treatments, setTreatments] = useState<
    (Treatment & { clinic_count?: number })[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // Manage clinic-treatment associations
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [linkTreatmentId, setLinkTreatmentId] = useState<string | null>(null);
  const [allClinics, setAllClinics] = useState<{ id: string; name: string }[]>([]);
  const [linkedClinicIds, setLinkedClinicIds] = useState<string[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: treatmentsData }, { data: ctData }, { data: clinicsData }] =
      await Promise.all([
        supabase.from("treatments").select("*").order("name"),
        supabase.from("clinic_treatments").select("treatment_id"),
        supabase.from("clinics").select("id, name").order("name"),
      ]);

    // Count clinics per treatment
    const countMap: Record<string, number> = {};
    (ctData ?? []).forEach((ct) => {
      countMap[ct.treatment_id] = (countMap[ct.treatment_id] ?? 0) + 1;
    });

    setTreatments(
      (treatmentsData ?? []).map((t) => ({
        ...t,
        clinic_count: countMap[t.id] ?? 0,
      }))
    );
    setAllClinics(clinicsData ?? []);
    setLoading(false);
  };

  const filtered = treatments.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (treatment: Treatment) => {
    setEditingId(treatment.id);
    setForm({
      name: treatment.name,
      category: treatment.category,
      starting_price_try:
        treatment.starting_price_try != null
          ? String(treatment.starting_price_try)
          : "",
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      category: form.category,
      starting_price_try: form.starting_price_try
        ? parseInt(form.starting_price_try, 10)
        : null,
    };

    if (editingId) {
      await supabase.from("treatments").update(payload).eq("id", editingId);
    } else {
      await supabase.from("treatments").insert(payload);
    }

    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    // Delete clinic_treatments associations first
    await supabase
      .from("clinic_treatments")
      .delete()
      .eq("treatment_id", deleteId);
    await supabase.from("treatments").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchData();
  };

  const openLinkDialog = async (treatmentId: string) => {
    setLinkTreatmentId(treatmentId);
    const { data } = await supabase
      .from("clinic_treatments")
      .select("clinic_id")
      .eq("treatment_id", treatmentId);
    setLinkedClinicIds((data ?? []).map((ct) => ct.clinic_id));
    setLinkDialogOpen(true);
  };

  const toggleClinicLink = async (clinicId: string) => {
    if (!linkTreatmentId) return;

    if (linkedClinicIds.includes(clinicId)) {
      await supabase
        .from("clinic_treatments")
        .delete()
        .eq("treatment_id", linkTreatmentId)
        .eq("clinic_id", clinicId);
      setLinkedClinicIds((prev) => prev.filter((id) => id !== clinicId));
    } else {
      await supabase
        .from("clinic_treatments")
        .insert({ treatment_id: linkTreatmentId, clinic_id: clinicId });
      setLinkedClinicIds((prev) => [...prev, clinicId]);
    }
    fetchData();
  };

  const categoryColors: Record<string, string> = {
    Infusion: "bg-blue-50 text-blue-700",
    Diagnostics: "bg-purple-50 text-purple-700",
    Regenerative: "bg-green-50 text-green-700",
    Recovery: "bg-orange-50 text-orange-700",
    Supplement: "bg-yellow-50 text-yellow-700",
    Other: "bg-gray-50 text-gray-700",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Treatments</h1>
          <p className="text-gray-500 text-sm">
            {treatments.length} treatment{treatments.length !== 1 ? "s" : ""}{" "}
            available
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Add Treatment
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search treatments..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Treatment</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden md:table-cell">Clinics</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                  {search ? "No treatments match your search." : "No treatments found."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((treatment) => (
                <TableRow key={treatment.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{treatment.name}</div>
                      <div className="text-xs text-gray-500">
                        /{treatment.slug}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        categoryColors[treatment.category] ?? categoryColors.Other
                      }
                    >
                      {treatment.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-600">
                    {treatment.clinic_count} clinic
                    {treatment.clinic_count !== 1 ? "s" : ""}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-600">
                    {treatment.starting_price_try != null
                      ? `~₺${treatment.starting_price_try.toLocaleString("tr-TR")}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        title="Link clinics"
                        onClick={() => openLinkDialog(treatment.id)}
                      >
                        <Link2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(treatment)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(treatment.id)}
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
        <DialogContent className="max-w-md max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white">
            <DialogTitle>
              {editingId ? "Edit Treatment" : "Add New Treatment"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="treatment-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            <div>
              <Label>Treatment Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="e.g. NAD+ IV Therapy"
              />
            </div>
            <div>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(val) => setForm({ ...form, category: val })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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
              <Label>Başlangıç Fiyatı (₺)</Label>
              <Input
                type="number"
                min="0"
                step="50"
                value={form.starting_price_try}
                onChange={(e) =>
                  setForm({ ...form, starting_price_try: e.target.value })
                }
                placeholder="örn. 1500 (boş = fiyat gösterilmez)"
              />
              <p className="text-xs text-gray-500 mt-1">
                Ana sayfadaki tedavi kartında &quot;~₺X&apos;den&quot; olarak
                gösterilir. Boş bırakılırsa fiyat gizlenir.
              </p>
            </div>
          </form>
          <div className="px-6 py-4 border-t shrink-0 bg-white">
            <Button
              form="treatment-form"
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Treatment"
                : "Add Treatment"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Link Clinics Dialog */}
      <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Link Clinics to Treatment</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-500 mb-4">
            Toggle clinics that offer this treatment.
          </p>
          <div className="space-y-2">
            {allClinics.map((clinic) => (
              <button
                key={clinic.id}
                type="button"
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                  linkedClinicIds.includes(clinic.id)
                    ? "bg-green-50 border-green-200 text-green-800"
                    : "bg-white hover:bg-gray-50 text-gray-700"
                }`}
                onClick={() => toggleClinicLink(clinic.id)}
              >
                <div className="flex items-center justify-between">
                  <span>{clinic.name}</span>
                  {linkedClinicIds.includes(clinic.id) && (
                    <Badge className="bg-green-600 text-white text-xs">
                      Linked
                    </Badge>
                  )}
                </div>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Treatment</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this treatment and unlink it from all
              clinics. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
