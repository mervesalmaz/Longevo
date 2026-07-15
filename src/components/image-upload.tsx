"use client";

import { useState, useRef } from "react";
import { Upload, Link2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string;
  folder?: string;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  bucket = "clinic-images",
  folder = "",
  label = "Cover Image",
}: ImageUploadProps) {
  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"url" | "file">(
    value && !value.includes(bucket) ? "url" : "file"
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File is too large. Max 5MB.");
      return;
    }

    setError("");
    setUploading(true);

    const ext = file.name.split(".").pop();
    const fileName = `${folder ? folder + "/" : ""}${crypto.randomUUID()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName);

    onChange(publicUrl);
    setUploading(false);
  };

  const handleRemove = () => {
    onChange("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1 text-xs">
          <button
            type="button"
            className={`px-2 py-0.5 rounded ${
              mode === "file"
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setMode("file")}
          >
            <Upload className="w-3 h-3 inline mr-1" />
            Upload
          </button>
          <button
            type="button"
            className={`px-2 py-0.5 rounded ${
              mode === "url"
                ? "bg-green-50 text-green-700 font-medium"
                : "text-gray-500 hover:text-gray-900"
            }`}
            onClick={() => setMode("url")}
          >
            <Link2 className="w-3 h-3 inline mr-1" />
            URL
          </button>
        </div>
      </div>

      {/* Preview */}
      {value && (
        <div className="relative rounded-lg overflow-hidden border bg-gray-50 aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full p-1 shadow"
          >
            <X className="w-4 h-4 text-gray-700" />
          </button>
        </div>
      )}

      {/* Input */}
      {mode === "file" ? (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                {value ? "Change Image" : "Upload from computer"}
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            PNG, JPG, WebP up to 5MB
          </p>
        </div>
      ) : (
        <Input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
        />
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
