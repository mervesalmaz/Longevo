"use client";

import { useState, useEffect } from "react";
import { Trash2, Search, Eye, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

interface ReviewRow {
  id: string;
  clinic_id: string;
  user_id: string;
  rating: number;
  title: string;
  body: string;
  treatment_received: string;
  verified_visit: boolean;
  created_at: string;
  clinic: { name: string; slug: string } | null;
}

export default function ReviewsAdmin() {
  const supabase = createClient();
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [clinics, setClinics] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClinic, setFilterClinic] = useState("all");
  const [filterRating, setFilterRating] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewReview, setViewReview] = useState<ReviewRow | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: reviewsData }, { data: clinicsData }] = await Promise.all([
      supabase
        .from("reviews")
        .select("*, clinic:clinics(name, slug)")
        .order("created_at", { ascending: false }),
      supabase.from("clinics").select("id, name").order("name"),
    ]);
    setReviews(
      (reviewsData ?? []).map((r) => ({
        ...r,
        clinic: Array.isArray(r.clinic) ? r.clinic[0] : r.clinic,
      }))
    );
    setClinics(clinicsData ?? []);
    setLoading(false);
  };

  const filtered = reviews.filter((r) => {
    const matchSearch =
      !search ||
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.body?.toLowerCase().includes(search.toLowerCase()) ||
      r.treatment_received?.toLowerCase().includes(search.toLowerCase());
    const matchClinic =
      filterClinic === "all" || r.clinic_id === filterClinic;
    const matchRating =
      filterRating === "all" || r.rating === parseInt(filterRating);
    return matchSearch && matchClinic && matchRating;
  });

  const handleDelete = async () => {
    if (!deleteId) return;
    await supabase.from("reviews").delete().eq("id", deleteId);
    setDeleteId(null);
    fetchData();
  };

  const toggleVerified = async (review: ReviewRow) => {
    await supabase
      .from("reviews")
      .update({ verified_visit: !review.verified_visit })
      .eq("id", review.id);
    setReviews((prev) =>
      prev.map((r) =>
        r.id === review.id
          ? { ...r, verified_visit: !r.verified_visit }
          : r
      )
    );
  };

  const ratingDots = (rating: number) => (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="w-2.5 h-2.5 rounded-full"
          style={{
            backgroundColor:
              i < rating ? "hsl(var(--longevo-green))" : "#E0E0E0",
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Reviews</h1>
        <p className="text-gray-500 text-sm">
          {reviews.length} review{reviews.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search reviews..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterClinic} onValueChange={setFilterClinic}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Clinics" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clinics</SelectItem>
            {clinics.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterRating} onValueChange={setFilterRating}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="All Ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} Star{r !== 1 ? "s" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead className="hidden md:table-cell">Clinic</TableHead>
              <TableHead className="hidden lg:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-12 text-gray-500"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((review) => (
                <TableRow key={review.id}>
                  <TableCell>{ratingDots(review.rating)}</TableCell>
                  <TableCell>
                    <div className="max-w-[250px]">
                      <div className="font-medium truncate">
                        {review.title || "No title"}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {review.body?.slice(0, 80)}
                        {(review.body?.length ?? 0) > 80 ? "..." : ""}
                      </div>
                      {review.treatment_received && (
                        <Badge variant="outline" className="text-xs mt-1">
                          {review.treatment_received}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-gray-600">
                    {review.clinic?.name ?? "—"}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="cursor-pointer"
                      variant={review.verified_visit ? "default" : "secondary"}
                      onClick={() => toggleVerified(review)}
                    >
                      {review.verified_visit ? (
                        <>
                          <ShieldCheck className="w-3 h-3 mr-1" />
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
                        onClick={() => setViewReview(review)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => setDeleteId(review.id)}
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

      {/* View Review Dialog */}
      <Dialog
        open={!!viewReview}
        onOpenChange={() => setViewReview(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Review Detail</DialogTitle>
          </DialogHeader>
          {viewReview && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3">
                {ratingDots(viewReview.rating)}
                <span className="text-sm text-gray-500">
                  {viewReview.rating}/5
                </span>
                {viewReview.verified_visit && (
                  <Badge>
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    Verified Visit
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-semibold">
                  {viewReview.title || "No title"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {viewReview.clinic?.name} &middot;{" "}
                  {new Date(viewReview.created_at).toLocaleDateString()}
                </p>
              </div>
              {viewReview.treatment_received && (
                <Badge variant="outline">
                  {viewReview.treatment_received}
                </Badge>
              )}
              <p className="text-sm text-gray-700 whitespace-pre-wrap">
                {viewReview.body}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this review. This action cannot be
              undone.
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
