"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

export function ContactForm() {
  const t = useTranslations("pages.contact.form");
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({ name: "", email: "", phone: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-xl border bg-brand-soft p-8 text-center">
        <CheckCircle className="mx-auto size-12 text-brand-accent" />
        <p className="mt-4 text-lg font-medium text-foreground">{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">{t("name")}</label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required placeholder={t("name")} />
        </div>
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder={t("email")} />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">{t("phone")}</label>
        <Input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder={t("phone")} />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">{t("message")}</label>
        <Textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={6} placeholder={t("message")} />
      </div>
      <Button type="submit" size="lg" className="w-full bg-brand-accent text-white hover:bg-brand-accent/90">
        {t("submit")}
        <Send className="ms-2 size-4" />
      </Button>
    </form>
  );
}
