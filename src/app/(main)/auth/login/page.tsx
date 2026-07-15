import { Suspense } from "react";
import { PageShell } from "@/components/home/PageShell";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="min-h-[80vh] flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Yükleniyor...
            </div>
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </PageShell>
  );
}
