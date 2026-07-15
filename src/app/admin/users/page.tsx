"use client";

import { useState, useEffect } from "react";
import { Search, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";

interface UserRow {
  id: string;
  display_name: string;
  avatar_url: string;
  created_at: string;
  review_count: number;
}

export default function UsersAdmin() {
  const supabase = createClient();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [{ data: profilesData }, { data: reviewsData }] = await Promise.all([
      supabase
        .from("users_profile")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase.from("reviews").select("user_id"),
    ]);

    const countMap: Record<string, number> = {};
    (reviewsData ?? []).forEach((r) => {
      countMap[r.user_id] = (countMap[r.user_id] ?? 0) + 1;
    });

    setUsers(
      (profilesData ?? []).map((p) => ({
        ...p,
        review_count: countMap[p.id] ?? 0,
      }))
    );
    setLoading(false);
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      (u.display_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-gray-500 text-sm">
          {users.length} user{users.length !== 1 ? "s" : ""} registered
        </p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search users..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead className="hidden md:table-cell">User ID</TableHead>
              <TableHead>Reviews</TableHead>
              <TableHead className="hidden lg:table-cell">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={4}>
                    <div className="h-10 bg-gray-100 animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-12 text-gray-500"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage
                          src={user.avatar_url}
                          alt={user.display_name}
                        />
                        <AvatarFallback className="bg-pink-50 text-pink-600 text-xs">
                          {(user.display_name ?? "U")
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium">
                        {user.display_name || "Anonymous"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <code className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded">
                      {user.id.slice(0, 8)}...
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm">{user.review_count}</span>
                      {user.review_count >= 5 && (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-amber-50 text-amber-700"
                        >
                          Active
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
