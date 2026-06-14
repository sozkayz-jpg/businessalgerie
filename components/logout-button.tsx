"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { type Locale } from "@/i18n/routing";
import { LogOut, Loader2 } from "lucide-react";

export function LogoutButton({ locale }: { locale: Locale }) {
  const t = useTranslations("member");
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push(`/${locale}/member/login`);
    router.refresh();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="me-2 size-4 animate-spin" />
      ) : (
        <LogOut className="me-2 size-4" />
      )}
      {t("logout")}
    </Button>
  );
}
