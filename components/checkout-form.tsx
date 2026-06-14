"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { type Locale } from "@/i18n/routing";
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react";

const CCP_ACCOUNT = "1234 5678 9012 3456";
const WHATSAPP_NUMBER = "213XXXXXXXXX";

export function CheckoutForm({
  courseSlug,
  courseTitle,
  amount,
  locale,
}: {
  courseSlug: string;
  courseTitle: string;
  amount: number;
  locale: Locale;
}) {
  const t = useTranslations("checkout.form");
  const router = useRouter();

  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = t("required");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = t("email_invalid");
    }
    if (!form.phone.trim()) next.phone = t("required");
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
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("loading");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseSlug,
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          courseTitle,
          amount,
          ccp: CCP_ACCOUNT,
        }),
      });

      if (res.ok) {
        setStatus("success");
        const message = encodeURIComponent(
          `Bonjour, je confirme ma commande pour *${courseTitle}*. Mon email est ${form.email.trim()}.`
        );
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, "_blank");
        router.push(`/${locale}/merci`);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("name")}</Label>
        <Input
          id="name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder={t("name_placeholder")}
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>

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
        <Label htmlFor="phone">{t("phone")}</Label>
        <Input
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder={t("phone_placeholder")}
          aria-invalid={!!errors.phone}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "loading"}
        className="w-full bg-brand-accent text-white hover:bg-brand-accent/90"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="me-2 size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            {t("submit")}
            <Send className="ms-2 size-4" />
          </>
        )}
      </Button>

      {status === "success" && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-green-600">
          <CheckCircle className="size-4" />
          {t("success")}
        </div>
      )}

      {status === "error" && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-destructive">
          <AlertCircle className="size-4" />
          {t("error")}
        </div>
      )}
    </form>
  );
}
