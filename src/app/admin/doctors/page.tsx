"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageUpload } from "@/components/image-upload";
import { createClient } from "@/lib/supabase/client";
import type { Doctor } from "@/lib/types";

const emptyForm = {
  clinic_id: "",
  name: "",
  title: "",
  bio: "",
  avatar_url: "",
  specialties: "",
};

export default function DoctorsAdmin() {
  const supabase = createClient();
  const [doctors, setDoctors] = useState<(Doctor & { clinic?: { name: string } })[]>([]);
  const [clinics, setClinics] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: doctorsData }, { data: clinicsData }] = await Promise.all([
      supabase
        .from("doctors")
        .select("*, clinic:clinics(name)")
        .order("created_at", { ascending: false }),
      supabase.from("clinics").select("id, name").order("name"),
    ]);
    setDoctors(
      (doctorsData ?? []).map((d) => ({
        ...d,
        clinic: Array.isArray(d.clinic) ? d.clinic[0] : d.clinic,
      }))
    );
    setClinics(clinicsData ?? []);
    setLoading(false);
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.clinic?.name ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (doc: Doctor) => {
    setEditingId(doc.id);
    setForm({
      clinic_id: doc.clinic_id,
      name: doc.name,
      title: doc.title ?? "",
      bio: doc.bio ?? "",
      avatar_url: doc.avatar_url ?? "",
      specialties: (doc.specialties ?? []).join(", "),
    });
    setDialogOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      clinic_id: form.clinic_id,
      name: form.name,
      title: form.title || null,
      bio: form.bio || null,
      avatar_url: form.avatar_url || null,
      specialties: form.specialties
        ? form.specialties.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
    };

    if (editingId) {
      await supabase.from("doctors").update(payload).eq("id", editingId);
    } else {
      await supabase.from("doctors").insert(payload);
    }

    setDialogOpen(false);
    setSaving(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("doctors").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-gray-500 text-sm">
            {doctors.length} doctor{doctors.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <Button className="gap-2" onClick={openAdd}>
          <Plus className="w-4 h-4" />
          Add Doctor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search doctors..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Doctor</TableHead>
              <TableHead className="hidden md:table-cell">Clinic</TableHead>
              <TableHead className="hidden lg:table-cell">Specialties</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-12 text-gray-500">
                  {search ? "No doctors match your search." : "No doctors found."}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={doc.avatar_url} alt={doc.name} />
                        <AvatarFallback className="bg-purple-50 text-purple-600 text-xs">
                          {doc.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.title}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-600">
                    {doc.clinic?.name ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {(doc.specialties ?? []).slice(0, 3).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">
                          {s}
                        </Badge>
                      ))}
                      {(doc.specialties ?? []).length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{doc.specialties.length - 3}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(doc)}>
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(doc.id)}
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
              {editingId ? "Edit Doctor" : "Add New Doctor"}
            </DialogTitle>
          </DialogHeader>
          <form
            id="doctor-form"
            onSubmit={handleSave}
            className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
          >
            <div>
              <Label>Clinic *</Label>
              <Select
                value={form.clinic_id}
                onValueChange={(val) => setForm({ ...form, clinic_id: val })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a clinic" />
                </SelectTrigger>
                <SelectContent>
                  {clinics.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Full Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label>Title / Position</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Regenerative Medicine Specialist"
              />
            </div>
            <div>
              <Label>Bio</Label>
              <Textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
              />
            </div>
            <ImageUpload
              value={form.avatar_url}
              onChange={(url) => setForm({ ...form, avatar_url: url })}
              folder="doctors"
              label="Avatar"
            />

            <div>
              <Label>Specialties (comma separated)</Label>
              <Input
                value={form.specialties}
                onChange={(e) =>
                  setForm({ ...form, specialties: e.target.value })
                }
                placeholder="e.g. NAD+ Therapy, Stem Cells, Longevity"
              />
            </div>
          </form>
          <div className="px-6 py-4 border-t shrink-0 bg-white">
            <Button
              form="doctor-form"
              type="submit"
              className="w-full"
              disabled={saving}
            >
              {saving ? "Saving..." : editingId ? "Update Doctor" : "Add Doctor"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Doctor</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this doctor. This action cannot be undone.
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
