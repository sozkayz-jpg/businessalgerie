"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations("pages.contact");
  const tf = useTranslations("pages.contact.form");
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Static placeholder: no backend. The submission is stored in component state.
    setSubmitted(true);
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-lg text-brand-text">{t("intro")}</p>
          </div>

          {submitted ? (
            <div className="rounded-xl border bg-brand-soft p-8 text-center">
              <CheckCircle className="mx-auto size-12 text-brand-accent" />
              <p className="mt-4 text-lg font-medium text-foreground">
                {tf("success")}
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    {tf("name")}
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder={tf("name")}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    {tf("email")}
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder={tf("email")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  {tf("phone")}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={tf("phone")}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  {tf("message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder={tf("message")}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full bg-brand-accent text-white hover:bg-brand-accent/90"
              >
                {tf("submit")}
                <Send className="ms-2 size-4" />
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
