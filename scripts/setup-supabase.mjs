import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("❌ Variables d'environnement manquantes");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function createTable() {
  console.log("🗄️  Création de la table orders...");

  const { error } = await supabase.rpc("exec_sql", {
    sql: `
      CREATE TABLE IF NOT EXISTS orders (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        course_slug TEXT NOT NULL,
        course_title TEXT NOT NULL,
        amount INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'validated', 'rejected')),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS "Allow service role full access" ON orders;
      CREATE POLICY "Allow service role full access" ON orders
        FOR ALL TO service_role USING (true) WITH CHECK (true);
      DROP POLICY IF EXISTS "Users see own orders" ON orders;
      CREATE POLICY "Users see own orders" ON orders
        FOR SELECT TO authenticated USING (email = (auth.jwt() ->> 'email'));
    `,
  });

  if (error) {
    console.error("❌ Erreur RPC exec_sql:", error.message);
    console.log("⚠️  La fonction exec_sql n'existe peut-être pas. Essai via REST direct...");
    return false;
  }

  console.log("✅ Table orders créée/mise à jour");
  return true;
}

async function createDemoAccounts() {
  console.log("👤 Création des comptes démo...");

  const accounts = [
    { email: "demo@businessalgerie.com", password: "demo123", name: "Utilisateur démo", role: "member" },
    { email: "admin@businessalgerie.com", password: "admin123", name: "Admin", role: "admin" },
  ];

  for (const account of accounts) {
    const { data: list, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error("❌ Impossible de lister les utilisateurs:", listError.message);
      continue;
    }

    const exists = list.users.some((u) => u.email === account.email);
    if (exists) {
      console.log(`ℹ️  ${account.email} existe déjà`);
      continue;
    }

    const { error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: account.password,
      email_confirm: true,
      user_metadata: { name: account.name, role: account.role },
    });

    if (error) {
      console.error(`❌ Erreur création ${account.email}:`, error.message);
    } else {
      console.log(`✅ Compte créé: ${account.email} (${account.role})`);
    }
  }
}

async function main() {
  await createTable();
  await createDemoAccounts();
  console.log("\n🎉 Configuration Supabase terminée");
}

main().catch((err) => {
  console.error("❌ Erreur fatale:", err);
  process.exit(1);
});
