import type { Metadata } from "next";
import { Resend } from "resend";
import { createOrder } from "@/lib/orders";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export const metadata: Metadata = {
  title: "Order Confirmation",
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload) {
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid payload" }),
      { status: 400 }
    );
  }

  const { email, name, phone, courseSlug, courseTitle, amount, ccp } = payload;

  if (!email || !name || !courseTitle || !amount || !courseSlug) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing fields" }),
      { status: 400 }
    );
  }

  const order = await createOrder({
    name,
    email,
    phone: phone || "",
    courseSlug,
    courseTitle,
    amount,
  });

  if (resend) {
    try {
      await resend.emails.send({
        from: "Business Algerie <noreply@businessalgerie.com>",
        to: email,
        subject: "Confirmation de votre commande — Business Algerie",
        html: `<p>Bonjour ${name},</p><p>Merci pour votre commande : <strong>${courseTitle}</strong>.</p><p>Montant : <strong>${amount} DA</strong></p><p>Veuillez envoyer votre reçu de paiement CCP (compte : <strong>${ccp || "à confirmer"}</strong>) par WhatsApp ou email.</p><p>L'équipe Business Algerie</p>`,
      });
    } catch (err) {
      console.error("Resend error", err);
    }
  }

  return new Response(JSON.stringify({ ok: true, orderId: order.id }), {
    status: 200,
  });
}
