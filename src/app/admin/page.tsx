"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "@/lib/supabase/client";
import type { Clinic } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    country: "",
    address: "",
    phone: "",
    website: "",
    cover_image_url: "",
    lat: "",
    lng: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      // Check admin email - we compare client-side for simplicity
      // In production, use a server action or API route
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      if (adminEmail && user.email !== adminEmail) {
        router.push("/");
        return;
      }

      setAuthorized(true);
      fetchClinics();
    };
    checkAuth();
  }, []);

  const fetchClinics = async () => {
    const { data } = await supabase
      .from("clinics")
      .select("*")
      .order("created_at", { ascending: false });
    setClinics(data ?? []);
    setLoading(false);
  };

  const toggleVerified = async (clinic: Clinic) => {
    const { error } = await supabase
      .from("clinics")
      .update({ verified: !clinic.verified })
      .eq("id", clinic.id);

    if (!error) {
      setClinics((prev) =>
        prev.map((c) =>
          c.id === clinic.id ? { ...c, verified: !c.verified } : c
        )
      );
    }
  };

  const handleAddClinic = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = slugify(form.name);

    const { error } = await supabase.from("clinics").insert({
      name: form.name,
      slug,
      description: form.description,
      city: form.city,
      country: form.country,
      address: form.address,
      phone: form.phone,
      website: form.website,
      cover_image_url: form.cover_image_url || null,
      lat: form.lat ? parseFloat(form.lat) : null,
      lng: form.lng ? parseFloat(form.lng) : null,
      verified: false,
    });

    if (!error) {
      setForm({
        name: "",
        description: "",
        city: "",
        country: "",
        address: "",
        phone: "",
        website: "",
        cover_image_url: "",
        lat: "",
        lng: "",
      });
      setDialogOpen(false);
      fetchClinics();
    }
  };

  if (!authorized) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Checking authorization...
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage clinics and listings</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus size={16} />
              Add Clinic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Clinic</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddClinic} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="name">Clinic Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={form.city}
                    onChange={(e) =>
                      setForm({ ...form, city: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={form.country}
                    onChange={(e) =>
                      setForm({ ...form, country: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={form.website}
                    onChange={(e) =>
                      setForm({ ...form, website: e.target.value })
                    }
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="cover">Cover Image URL</Label>
                <Input
                  id="cover"
                  value={form.cover_image_url}
                  onChange={(e) =>
                    setForm({ ...form, cover_image_url: e.target.value })
                  }
                  placeholder="https://..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="lat">Latitude</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="any"
                    value={form.lat}
                    onChange={(e) =>
                      setForm({ ...form, lat: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="lng">Longitude</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="any"
                    value={form.lng}
                    onChange={(e) =>
                      setForm({ ...form, lng: e.target.value })
                    }
                  />
                </div>
              </div>
              <Button type="submit" className="w-full">
                Add Clinic
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {clinics.map((clinic) => (
            <Card key={clinic.id}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {clinic.cover_image_url ? (
                    <img
                      src={clinic.cover_image_url}
                      alt={clinic.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                      {clinic.name[0]}
                    </div>
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{clinic.name}</h3>
                      {clinic.verified && (
                        <Badge className="bg-primary text-white text-xs gap-1">
                          <BadgeCheck size={12} />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clinic.city}, {clinic.country}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      /{clinic.slug}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={clinic.verified ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleVerified(clinic)}
                  >
                    {clinic.verified ? "Unverify" : "Verify"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          {clinics.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              No clinics found. Add your first clinic above.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
