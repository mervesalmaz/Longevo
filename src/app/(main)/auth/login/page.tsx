import { Suspense } from "react";
import { PageShell } from "@/components/home/PageShell";
import { getT } from "@/lib/i18n/server";
import LoginForm from "./login-form";

export default function LoginPage() {
  const t = getT();
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              {t("common_loading")}
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}
