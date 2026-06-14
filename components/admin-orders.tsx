"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Locale } from "@/i18n/routing";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type OrderStatus = "pending" | "paid" | "validated" | "rejected";

type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  courseSlug: string;
  courseTitle: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
};

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  paid: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  validated: "bg-green-100 text-green-800 hover:bg-green-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
};

export function AdminOrders({ locale }: { locale: Locale }) {
  const t = useTranslations("admin");
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
        setLoading(false);
      });
  }, []);

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id);
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o))
      );
    }
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="size-6 animate-spin text-brand-primary" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-8 text-center">
        <p className="text-brand-text">{t("empty")}</p>
      </div>
    );
  }

  const currency = locale === "ar" ? "دج" : locale === "en" ? "DZD" : "DA";

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border bg-card p-5 shadow-sm"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <h2 className="font-heading text-lg font-semibold text-foreground">
                {order.courseTitle}
              </h2>
              <p className="text-sm text-brand-text">
                {order.name} · {order.email} · {order.phone}
              </p>
              <p className="text-sm text-brand-text">
                {new Date(order.createdAt).toLocaleString(locale === "ar" ? "ar-DZ" : locale === "en" ? "en-GB" : "fr-FR")}
                {" · "}
                <span className="font-medium text-foreground">
                  {order.amount.toLocaleString(locale === "ar" ? "ar-DZ" : locale === "en" ? "en-US" : "fr-FR")} {currency}
                </span>
              </p>
              <Badge className={cn("mt-1", statusStyles[order.status])}>
                {t(`status.${order.status}`)}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                className="border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => updateStatus(order.id, "validated")}
                disabled={updating === order.id || order.status === "validated"}
              >
                <CheckCircle className="me-1 size-4" />
                {t("validate")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-red-600 text-red-700 hover:bg-red-50"
                onClick={() => updateStatus(order.id, "rejected")}
                disabled={updating === order.id || order.status === "rejected"}
              >
                <XCircle className="me-1 size-4" />
                {t("reject")}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
