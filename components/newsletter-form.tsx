"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export function NewsletterForm() {
  const t = useTranslations("home.newsletter");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);

    if (!isValid) {
      setStatus("error");
      return;
    }

    setStatus("success");
    setEmail("");
  };

  return (
    <section className="border-y bg-background py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mx-auto inline-flex rounded-full bg-brand-accent/10 p-3 text-brand-accent">
            <Mail className="size-6" />
          </div>
          <h2 className="mt-4 font-heading text-2xl font-bold text-foreground md:text-3xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-brand-text">{t("subtitle")}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center"
          >
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder={t("placeholder")}
              className="h-10 flex-1"
              aria-invalid={status === "error"}
              required
            />
            <Button
              type="submit"
              className="h-10 bg-brand-accent text-white hover:bg-brand-accent/90"
            >
              {t("button")}
            </Button>
          </form>

          {status === "success" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle className="size-4" />
              {t("success")}
            </div>
          )}
          {status === "error" && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-destructive">
              <AlertCircle className="size-4" />
              {t("error")}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
