import { createAdminClient } from "@/lib/supabase/admin";

export type OrderStatus = "pending" | "paid" | "validated" | "rejected";

export type Order = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course_slug: string;
  course_title: string;
  amount: number;
  status: OrderStatus;
  created_at: string;
};

export async function getOrders(): Promise<Order[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getOrders error", error);
    return [];
  }

  return (data as Order[]) || [];
}

export async function createOrder(
  order: Omit<Order, "id" | "status" | "created_at">
): Promise<Order | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      ...order,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("createOrder error", error);
    return null;
  }

  return data as Order;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateOrderStatus error", error);
    return null;
  }

  return data as Order;
}
