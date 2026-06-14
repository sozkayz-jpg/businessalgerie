"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Locale } from "@/i18n/routing";
import { Loader2, AlertCircle } from "lucide-react";

export function LoginForm({ locale }: { locale: Locale }) {
  const t = useTranslations("member.login");
  const router = useRouter();

  const [form, setForm] = React.useState({ email: "", password: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = React.useState("");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.email.trim()) next.email = t("required");
    if (!form.password.trim()) next.password = t("required");
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password.trim(),
        }),
      });

      if (res.ok) {
        window.location.href = `/${locale}/member`;
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data.error === "invalid_credentials" ? t("error") : t("error"));
        setStatus("error");
      }
    } catch (err) {
      console.error("Login error", err);
      setErrorMsg(t("error"));
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder={t("email_placeholder")}
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("password")}</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={t("password_placeholder")}
          aria-invalid={!!errors.password}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-brand-accent text-white hover:bg-brand-accent/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="me-2 size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          t("submit")
        )}
      </Button>

      {status === "error" && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-destructive">
          <AlertCircle className="size-4" />
          {errorMsg || t("error")}
        </div>
      )}

      <div className="rounded-lg bg-brand-soft p-3 text-xs text-brand-text">
        <p className="font-medium">{t("demo_accounts")}</p>
        <p>{t("demo_member")}</p>
        <p>{t("demo_admin")}</p>
      </div>
    </form>
  );
}
