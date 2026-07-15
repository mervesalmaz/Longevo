"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Leaf, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

const ERROR_MESSAGES: Record<string, string> = {
  not_admin:
    "Bu hesap admin paneline erişim yetkisine sahip değil. Doğru hesapla giriş yap.",
  admin_unconfigured:
    "Admin paneli yapılandırılmamış. Sistem yöneticisiyle iletişime geç.",
  auth_failed: "Oturum açılamadı. Lütfen tekrar dene.",
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Capture ?redirect=/admin and ?error=not_admin from middleware
  const redirectTo = searchParams.get("redirect") ?? "/";
  const middlewareError = searchParams.get("error");
  const initialError = middlewareError
    ? ERROR_MESSAGES[middlewareError] ?? "Bir hata oluştu."
    : "";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Use full-page nav so middleware runs with the refreshed cookie —
    // router.push can stay on the same cached response.
    window.location.href = redirectTo;
  };

  const displayError = error || initialError;

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Longevo</span>
            </div>
            <h1 className="text-xl font-semibold">Tekrar hoş geldin</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Devam etmek için hesabınla giriş yap
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">E-posta</Label>
              <Input
                id="email"
                type="email"
                placeholder="sen@ornek.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {displayError && (
              <div
                role="alert"
                className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{displayError}</span>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Hesabın yok mu?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              Kaydol
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
