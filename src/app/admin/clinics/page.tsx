"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  BadgeCheck,
  Search,
  ExternalLink,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { Clinic } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const emptyForm = {
  name: "",
  editorial_summary: "",
  original_description: "",
  city: "",
  country: "",
  address: "",
  phone: "",
  website: "",
  cover_image_url: "",
  lat: "",
  lng: "",
  verified: false,
};

export default function ClinicsAdmin() {
  const supabase = createClient();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchClinics();
  }, []);

  const fetchClinics = async () => {
    const { data } = await supabase
      .from("clinics")
      .select("*")
      .order("created_at", { ascending: false });
    setClinics(data ?? []);
    setLoading(false);
  };

  const filtered = clinics.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (clinic: Clinic) => {
    setEditingId(clinic.id);
    setForm({
      name: clinic.name,
      editorial_summary: clinic.editorial_summary ?? "",
      original_description:
        clinic.original_description ?? clinic.description ?? "",
      city: clinic.city,
      country: clinic.country,
      address: clinic.address ?? "",
      phone: clinic.phone ?? "",
      website: clinic.website ?? "",
      cover_image_url: clinic.cover_image_url ?? "",
      lat: clinic.lat ? String(clinic.lat) : "",
      lng: clinic.lng ? String(clinic.lng) : "",
      verified: clinic.verified,
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      slug: slugify(form.name),
      editorial_summary: form.editorial_summary.trim() || null,
      original_description: form.original_description.trim() || null,
      // Mirror to legacy `description` for backward compatibility
      description: form.original_description.trim() || null,
      city: form.city,
      country: form.country,
      address: form.address || null,
      phone: form.phone || null,
      website: form.website || null,
      cover_image_url: form.cover_image_url || null,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      verified: form.verified,
    };

    if (editingId) {
      await supabase.from("clinics").update(payload).eq("id", editingId);
    } else {
      await supabase.from("clinics").insert(payload);
    }

    setDialogOpen(false);
    setSaving(false);
    fetchClinics();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("clinics").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchClinics();
  };

  const toggleVerified = async (clinic: Clinic) => {
    await supabase
      .from("clinics")
      .update({ verified: !clinic.verified })
      .eq("id", clinic.id);
    setClinics((prev) =>
      prev.map((c) =>
        c.id === clinic.id ? { ...c, verified: !c.verified } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Clinics</h1>
          <p className="text-gray-500 text-sm">
            {clinics.length} clinic{clinics.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Add Clinic
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search clinics..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Clinic</TableHead>
              <TableHead className="hidden md:table-cell">Location</TableHead>
              <TableHead className="hidden lg:table-cell">Contact</TableHead>
              <TableHead>Status</TableHead>
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
                  {search ? "No clinics match your search." : "No clinics found. Add your first clinic."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {clinic.cover_image_url ? (
                        <img
                          src={clinic.cover_image_url}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center font-bold text-green-600">
                          {clinic.name[0]}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{clinic.name}</div>
                        <div className="text-xs text-gray-500">/{clinic.slug}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-3 h-3" />
                      {clinic.city}, {clinic.country}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="text-sm text-gray-600">
                      {clinic.phone && <div>{clinic.phone}</div>}
                      {clinic.website && (
                        <a
                          href={clinic.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline flex items-center gap-1"
                        >
                          Website <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="cursor-pointer"
                      variant={clinic.verified ? "default" : "secondary"}
                      onClick={() => toggleVerified(clinic)}
                    >
                      {clinic.verified ? (
                        <>
                          <BadgeCheck className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        "Unverified"
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(clinic)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(clinic.id)}
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
        <DialogContent className="max-w-lg max-h-[90vh] p-0 gap-0 flex flex-col overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b shrink-0 bg-white">
            <DialogTitle>
              {editingId ? "Edit Clinic" : "Add New Clinic"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="clinic-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            <div>
              <Label>Clinic Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Editorial Summary (max 200)</Label>
              <Textarea
                value={form.editorial_summary}
                onChange={(e) =>
                  setForm({
                    ...form,
                    editorial_summary: e.target.value.slice(0, 200),
                  })
                }
                rows={3}
                placeholder="Longevo'nun kendi pozisyonlama metni. Ana sayfada ve hero'da bu gösterilir."
              />
              <div className="text-xs text-gray-500 mt-1 text-right">
                {form.editorial_summary.length}/200
              </div>
            </div>
            <div>
              <Label>Original Description (clinic&apos;s own)</Label>
              <Textarea
                value={form.original_description}
                onChange={(e) =>
                  setForm({ ...form, original_description: e.target.value })
                }
                rows={4}
                placeholder="Klinik tarafından yazılan uzun açıklama. Detay sayfasında 'About' bölümünde gösterilir."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>City *</Label>
                <Input
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label>Country *</Label>
                <Input
                  value={form.country}
                  onChange={(e) =>
                    setForm({ ...form, country: e.target.value })
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Phone</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
              <div>
                <Label>Website</Label>
                <Input
                  value={form.website}
                  onChange={(e) =>
                    setForm({ ...form, website: e.target.value })
                  }
                />
              </div>
            </div>
            <ImageUpload
              value={form.cover_image_url}
              onChange={(url) => setForm({ ...form, cover_image_url: url })}
              folder="clinics"
              label="Cover Image"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Latitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.lat}
                  onChange={(e) => setForm({ ...form, lat: e.target.value })}
                />
              </div>
              <div>
                <Label>Longitude</Label>
                <Input
                  type="number"
                  step="any"
                  value={form.lng}
                  onChange={(e) => setForm({ ...form, lng: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.verified}
                onCheckedChange={(checked) =>
                  setForm({ ...form, verified: checked })
                }
              />
              <Label>Verified Clinic</Label>
            </div>
          </form>
          <div className="px-6 py-4 border-t shrink-0 bg-white">
            <Button
              form="clinic-form"
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Clinic"
                : "Add Clinic"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Clinic</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this clinic and all associated
              doctors, treatments, and reviews. This action cannot be undone.
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
