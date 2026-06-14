import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET || "change-me-in-production"
);

export type User = {
  email: string;
  name: string;
  role: "member" | "admin";
};

const DEMO_USERS: Record<string, { password: string; name: string; role: User["role"] }> = {
  "demo@businessalgerie.com": { password: "demo123", name: "Utilisateur démo", role: "member" },
  "admin@businessalgerie.com": { password: "admin123", name: "Admin", role: "admin" },
};

export async function signIn(email: string, password: string): Promise<User | null> {
  const user = DEMO_USERS[email.toLowerCase()];
  if (!user || user.password !== password) {
    return null;
  }

  const token = await new SignJWT({ email, name: user.name, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return { email, name: user.name, role: user.role };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}

export async function getSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as User["role"],
    };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<User> {
  const user = await getSession();
  if (!user) {
    redirect("/member/login");
  }
  return user;
}

export async function getSessionFromRequest(request: NextRequest): Promise<User | null> {
  const token = request.cookies.get("session")?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      email: payload.email as string,
      name: payload.name as string,
      role: payload.role as User["role"],
    };
  } catch {
    return null;
  }
}
