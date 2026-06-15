-- CMS Foundation for businessalgerie.com
-- Keeps existing orders/auth tables, adds content management + analytics tables.

-- Custom types
DO $$ BEGIN
    CREATE TYPE publish_status AS ENUM ('draft', 'published', 'scheduled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Site-wide brand & settings
CREATE TABLE IF NOT EXISTS site_settings (
    id text PRIMARY KEY DEFAULT 'default',
    brand_name jsonb NOT NULL DEFAULT '{"fr":"Business Algerie","ar":"بيزنس الجزائر","en":"Business Algerie"}',
    tagline jsonb NOT NULL DEFAULT '{"fr":"Formations et accompagnement marketing digital en Algérie.","ar":"دورات تدريبية ومرافقة في التسويق الرقمي في الجزائر.","en":"Digital marketing training and coaching in Algeria."}',
    logo_url text,
    favicon_url text,
    colors jsonb NOT NULL DEFAULT '{
        "primary":"#0f172a",
        "accent":"#f97316",
        "soft":"#f8fafc",
        "text":"#334155",
        "background":"#ffffff",
        "foreground":"#334155"
    }',
    fonts jsonb NOT NULL DEFAULT '{"heading":"var(--font-sans)","body":"var(--font-sans)"}',
    seo_default jsonb NOT NULL DEFAULT '{
        "titleTemplate":"%s | Business Algerie",
        "description":"Formations et accompagnement marketing digital en Algérie.",
        "keywords":["marketing digital","Algérie","e-commerce","formation","site web"],
        "ogImageUrl":"/images/hero.webp"
    }',
    social_links jsonb NOT NULL DEFAULT '{
        "facebook":"https://facebook.com/businessalgerie",
        "instagram":"https://instagram.com/businessalgerie",
        "linkedin":"https://linkedin.com/company/businessalgerie",
        "youtube":"https://youtube.com/@businessalgerie"
    }',
    pixels jsonb NOT NULL DEFAULT '{"facebook":null,"tiktok":null,"linkedin":null}',
    analytics jsonb NOT NULL DEFAULT '{"ga4MeasurementId":null,"searchConsoleHtmlTag":null}',
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Pages: home, agence, services, a-propos, contact, formations, mentions-legales, confidentialite, custom...
CREATE TABLE IF NOT EXISTS pages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    is_system boolean NOT NULL DEFAULT false,
    meta jsonb NOT NULL DEFAULT '{}',
    blocks jsonb NOT NULL DEFAULT '[]',
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Blog posts
CREATE TABLE IF NOT EXISTS blog_posts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    status publish_status NOT NULL DEFAULT 'draft',
    published_at timestamptz,
    author text,
    category jsonb NOT NULL DEFAULT '{}',
    reading_time int NOT NULL DEFAULT 5,
    image text,
    video_id text,
    title jsonb NOT NULL DEFAULT '{}',
    excerpt jsonb NOT NULL DEFAULT '{}',
    content jsonb NOT NULL DEFAULT '[]',
    meta jsonb NOT NULL DEFAULT '{}',
    seo_score int,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Courses / formations
CREATE TABLE IF NOT EXISTS courses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    slug text UNIQUE NOT NULL,
    title jsonb NOT NULL DEFAULT '{}',
    price_dzd int NOT NULL DEFAULT 0,
    is_flagship boolean NOT NULL DEFAULT false,
    image text,
    description jsonb NOT NULL DEFAULT '{}',
    learn jsonb NOT NULL DEFAULT '[]',
    program jsonb NOT NULL DEFAULT '[]',
    meta jsonb NOT NULL DEFAULT '{}',
    published boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Internal analytics
CREATE TABLE IF NOT EXISTS page_views (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    path text NOT NULL,
    locale text NOT NULL DEFAULT 'fr',
    referrer text,
    utm_source text,
    utm_medium text,
    utm_campaign text,
    session_id text,
    user_agent text,
    created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text NOT NULL,
    path text,
    payload jsonb NOT NULL DEFAULT '{}',
    session_id text,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Media uploads stored in Supabase Storage; this table tracks metadata
CREATE TABLE IF NOT EXISTS media (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    url text NOT NULL,
    content_type text,
    size int,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- RLS policies: only admins can write public content; anyone can read published rows.
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='site_settings' AND policyname='site_settings_public_read') THEN
        CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='pages' AND policyname='pages_public_read') THEN
        CREATE POLICY "pages_public_read" ON pages FOR SELECT USING (published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='blog_posts' AND policyname='blog_posts_public_read') THEN
        CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (status = 'published');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='courses' AND policyname='courses_public_read') THEN
        CREATE POLICY "courses_public_read" ON courses FOR SELECT USING (published = true);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='media' AND policyname='media_public_read') THEN
        CREATE POLICY "media_public_read" ON media FOR SELECT USING (true);
    END IF;
END $$;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(path);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_created ON events(created_at);

-- Helper to update updated_at automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON blog_posts;
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_courses_updated_at ON courses;
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Storage bucket for media uploads
INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
SELECT 'media', 'media', true, false, 5242880, '{"image/*"}'
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'media');
