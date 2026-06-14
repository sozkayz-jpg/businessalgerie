import { NextRequest } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { ok: false, error: "missing_credentials" },
      { status: 400 }
    );
  }

  const user = await signIn(email, password);
  if (!user) {
    return Response.json(
      { ok: false, error: "invalid_credentials" },
      { status: 401 }
    );
  }

  return Response.json({ ok: true, user: { name: user.name, role: user.role } });
}
