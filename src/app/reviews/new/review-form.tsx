"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StarRating } from "@/components/star-rating";
import { createClient } from "@/lib/supabase/client";

export default function ReviewForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clinicSlug = searchParams.get("clinic");
  const supabase = createClient();

  const [user, setUser] = useState<{ id: string } | null>(null);
  const [clinic, setClinic] = useState<{ id: string; name: string; slug: string } | null>(null);
  const [treatments, setTreatments] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [treatmentReceived, setTreatmentReceived] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push(`/auth/login?redirect=/reviews/new?clinic=${clinicSlug}`);
        return;
      }
      setUser(user);

      if (!clinicSlug) { router.push("/search"); return; }

      const { data: clinicData } = await supabase
        .from("clinics")
        .select(`id, name, slug, clinic_treatments (treatment:treatments(name))`)
        .eq("slug", clinicSlug)
        .single();

      if (!clinicData) { router.push("/search"); return; }

      setClinic(clinicData);
      setTreatments(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clinicData.clinic_treatments?.map((ct: any) => (Array.isArray(ct.treatment) ? ct.treatment[0] : ct.treatment)).filter(Boolean) ?? []
      );
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clinicSlug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !clinic) return;
    if (rating === 0) { setError("Please select a rating"); return; }
    if (!title.trim()) { setError("Please add a title"); return; }
    if (!body.trim()) { setError("Please write your review"); return; }

    setError("");
    setSubmitting(true);

    const { error: insertError } = await supabase.from("reviews").insert({
      clinic_id: clinic.id, user_id: user.id, rating,
      title: title.trim(), body: body.trim(),
      treatment_received: treatmentReceived || null,
    });

    if (insertError) { setError(insertError.message); setSubmitting(false); }
    else { router.push(`/clinics/${clinic.slug}`); }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Write a Review</h1>
            <p className="text-muted-foreground mt-1">
              Share your experience at{" "}
              <span className="font-medium text-foreground">{clinic?.name}</span>
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="mb-2 block">Overall Rating</Label>
              <StarRating rating={rating} size={32} interactive onChange={setRating} />
            </div>
            {treatments.length > 0 && (
              <div>
                <Label className="mb-2 block">Treatment Received</Label>
                <Select value={treatmentReceived} onValueChange={setTreatmentReceived}>
                  <SelectTrigger><SelectValue placeholder="Select treatment (optional)" /></SelectTrigger>
                  <SelectContent>
                    {treatments.map((t) => (<SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="title">Review Title</Label>
              <Input id="title" placeholder="Summarize your experience" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100} />
            </div>
            <div>
              <Label htmlFor="body">Your Review</Label>
              <Textarea id="body" placeholder="Tell others about your experience..." value={body} onChange={(e) => setBody(e.target.value)} rows={6} />
            </div>
            {error && <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</p>}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit Review"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
