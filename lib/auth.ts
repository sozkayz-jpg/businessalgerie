import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export type User = {
  email: string;
  name: string;
  role: "member" | "admin";
};

export async function signIn(email: string, password: string): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    console.error("signIn error", error);
    return null;
  }

  const role = data.user.user_metadata?.role || "member";
  const name = data.user.user_metadata?.name || email;

  return {
    email: data.user.email!,
    name,
    role,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function getSession(): Promise<User | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    return null;
  }

  return {
    email: data.user.email!,
    name: data.user.user_metadata?.name || data.user.email!,
    role: data.user.user_metadata?.role || "member",
  };
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    redirect("/member/login");
  }
  return user;
}

export async function createDemoAccounts() {
  const supabase = createAdminClient();
  const accounts: { email: string; password: string; name: string; role: User["role"] }[] = [
    { email: "demo@businessalgerie.com", password: "demo123", name: "Utilisateur démo", role: "member" },
    { email: "admin@businessalgerie.com", password: "admin123", name: "Admin", role: "admin" },
  ];

  for (const account of accounts) {
    const { data: existing } = await supabase.auth.admin.listUsers();
    const alreadyExists = existing.users.some((u) => u.email === account.email);
    if (alreadyExists) continue;

    const { error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { name: account.name, role: account.role },
    });

    if (error) {
      console.error(`createDemoAccounts error for ${account.email}`, error);
    }
  }
}
