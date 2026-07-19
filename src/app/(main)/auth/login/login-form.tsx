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
import { useTranslation } from "@/lib/i18n/locale-provider";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const { t } = useTranslation();

  const ERROR_MESSAGES: Record<string, string> = {
    not_admin: t("login_error_not_admin"),
    admin_unconfigured: t("login_error_admin_unconfigured"),
    auth_failed: t("login_error_auth_failed"),
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Capture ?redirect=/admin and ?error=not_admin from middleware.
  // Only allow internal paths — never redirect off-site (open-redirect guard).
  const rawRedirect = searchParams.get("redirect") ?? "/";
  const redirectTo =
    rawRedirect.startsWith("/") && !rawRedirect.startsWith("//")
      ? rawRedirect
      : "/";
  const middlewareError = searchParams.get("error");
  const initialError = middlewareError
    ? ERROR_MESSAGES[middlewareError] ?? t("login_error_generic")
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
            <h1 className="text-xl font-semibold">{t("login_welcome_back")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("login_subtitle")}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("auth_email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password">{t("auth_password")}</Label>
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
              {loading ? t("login_submitting") : t("login_submit")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("login_no_account")}{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              {t("login_signup_link")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
