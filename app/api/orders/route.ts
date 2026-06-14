import { NextRequest } from "next/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/orders";

export async function GET() {
  const orders = await getOrders();
  return Response.json({ orders });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body) {
    return Response.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  if (body.id && body.status) {
    const updated = await updateOrderStatus(body.id, body.status);
    if (!updated) {
      return Response.json({ ok: false, error: "not_found" }, { status: 404 });
    }
    return Response.json({ ok: true, order: updated });
  }

  const order = await createOrder(body);
  return Response.json({ ok: true, order }, { status: 201 });
}
