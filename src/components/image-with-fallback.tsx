"use client";

import { useState } from "react";

interface ImageWithFallbackProps {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export function ImageWithFallback({ src, alt, className = "", fallbackText }: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className={`bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center ${className}`}>
        <span className="text-4xl font-bold text-green-300">
          {fallbackText || alt.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}
