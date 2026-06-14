import { promises as fs } from "fs";
import { join } from "path";

export type OrderStatus = "pending" | "paid" | "validated" | "rejected";

export type Order = {
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

const ORDERS_FILE = join(process.cwd(), "data", "orders.json");

async function readOrders(): Promise<Order[]> {
  try {
    const raw = await fs.readFile(ORDERS_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeOrders(orders: Order[]) {
  await fs.mkdir(join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(ORDERS_FILE, JSON.stringify(orders, null, 2) + "\n");
}

export async function getOrders(): Promise<Order[]> {
  const orders = await readOrders();
  return orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createOrder(order: Omit<Order, "id" | "status" | "createdAt">): Promise<Order> {
  const orders = await readOrders();
  const newOrder: Order = {
    ...order,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  await writeOrders(orders);
  return newOrder;
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order | null> {
  const orders = await readOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;
  orders[index].status = status;
  await writeOrders(orders);
  return orders[index];
}
