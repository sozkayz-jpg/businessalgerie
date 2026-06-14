-- Exécuter dans l'éditeur SQL de Supabase

-- Table des commandes
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

-- Active RLS mais permet toutes les opérations via service_role
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Politique : les admins peuvent tout faire
CREATE POLICY "Allow service role full access" ON orders
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Politique : l'utilisateur connecté ne voit que ses commandes
CREATE POLICY "Users see own orders" ON orders
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');
