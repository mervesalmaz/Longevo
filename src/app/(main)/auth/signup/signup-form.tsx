"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/locale-provider";

export default function SignupForm() {
  const router = useRouter();
  const supabase = createClient();
  const { t } = useTranslation();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError(t("signup_password_min"));
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Leaf className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-xl font-semibold mb-2">
              {t("signup_check_email_title")}
            </h1>
            <p className="text-muted-foreground">
              {t("signup_confirm_sent")} <strong>{email}</strong>.{" "}
              {t("signup_confirm_check")}
            </p>
            <Button variant="outline" className="mt-6" asChild>
              <Link href="/auth/login">{t("signup_back_to_login")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Longevo</span>
            </div>
            <h1 className="text-xl font-semibold">{t("signup_title")}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {t("signup_subtitle")}
            </p>
          </div>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">{t("signup_display_name")}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t("signup_name_placeholder")}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">{t("auth_email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth_email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
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
                minLength={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {t("signup_password_hint")}
              </p>
            </div>

            {error && (
              <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? t("signup_submitting") : t("signup_submit")}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {t("signup_have_account")}{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              {t("signup_login_link")}
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
