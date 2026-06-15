import { createClient } from "@/lib/supabase/server";
import { NextRequest } from "next/server";

export async function requireAdmin(request?: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return { user: null, error: "unauthorized" };
  }

  const role = data.user.user_metadata?.role;
  if (role !== "admin") {
    return { user: null, error: "forbidden" };
  }

  return { user: data.user, error: null };
}
