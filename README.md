# Business Algerie

Site vitrine, catalogue de formations, tunnel de vente CCP, espace membre et back-office admin pour **Business Algerie**.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS 4
- next-intl (FR / AR / EN)
- shadcn/ui + Base UI
- Resend (emails)
- Supabase Auth + Supabase PostgreSQL

## Pages principales

- `/[locale]` — Landing page
- `/[locale]/formations` — Catalogue
- `/[locale]/formations/[slug]` — Détail formation
- `/[locale]/checkout/[formation]` — Commande CCP
- `/[locale]/merci` — Instructions de paiement
- `/[locale]/member/login` — Connexion membre
- `/[locale]/member` — Dashboard formations
- `/[locale]/member/formations/[slug]` — Lecteur formation
- `/[locale]/admin` — Validation des commandes (rôle admin)
- `/[locale]/blog` — Blog
- `/[locale]/blog/[slug]` — Article

## Démarrage local

```bash
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Comptes de démonstration

## Configuration Supabase

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Exécuter `supabase/schema.sql` dans l'éditeur SQL
3. Créer 2 utilisateurs dans Auth > Users (avec email confirmé) :

| Email | Mot de passe | Rôle (user_metadata) |
|---|---|---|
| `demo@businessalgerie.com` | `demo123` | `{ole: member}` |
| `admin@businessalgerie.com` | `admin123` | `{ole: admin}` |

## Comptes de démo|---|---|
| `demo@businessalgerie.com` | `demo123` | Membre |
| `admin@businessalgerie.com` | `admin123` | Admin |

## Déploiement Vercel

1. Importer le projet sur [vercel.com](https://vercel.com).
2. Ajouter les variables d'environnement depuis `.env.example` :
   - `AUTH_SECRET` — longue chaîne aléatoire
   - `RESEND_API_KEY` — pour l'envoi d'emails
3. Déployer.

> Note : les commandes sont stockées dans Supabase PostgreSQL.

## Scripts

```bash
npm run dev     # développement
npm run build   # production build
npm run lint    # eslint
```
