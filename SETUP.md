# AI Barista — Setup & deployment

This app uses **Supabase** (email/password auth + Postgres) and **Google Gemini**
(free tier) for AI cups. Premium cups unlock by **signing up** — no payment.

---

## 0. Local setup

```bash
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev
```

---

## 1. Supabase

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**.
2. **Project Settings → API** — copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. **SQL Editor** → paste and run [`supabase/schema.sql`](./supabase/schema.sql).
4. **Authentication → Providers → Email** — enabled.
5. **Disable "Confirm email"** so signup works instantly (good for demos).
6. **Authentication → URL Configuration**:
   - **Site URL**: `http://localhost:3000` (local) or your production URL later.

---

## 2. Google Gemini (free AI)

1. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
2. Add to `.env.local`:

   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your-key-here
   ```

3. Optional: `GEMINI_MODEL=gemini-3.5-flash` (this is the default in code).

---

## 3. Deploy to production (Vercel)

Vercel is the simplest host for Next.js. Steps:

### Step 1 — Push code to GitHub

```bash
git add .
git commit -m "Prepare for production deploy"
git push origin main
```

### Step 2 — Import project in Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repo.
3. Framework preset: **Next.js** (auto-detected).
4. Click **Deploy** (first deploy may fail without env vars — that's OK).

### Step 3 — Add environment variables in Vercel

In your Vercel project: **Settings → Environment Variables**.

Add **all** of these for **Production** (and **Preview** if you want preview URLs to work):

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | `https://your-app.vercel.app` | Your Vercel domain (Settings → Domains) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API (anon public) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | your Gemini key | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `GEMINI_MODEL` | `gemini-3.5-flash` | Optional — already the default |

**You do NOT need:**
- ~~Stripe keys~~ (removed — signup unlocks premium, no payment)
- ~~`SUPABASE_SERVICE_ROLE_KEY`~~ (not used)
- ~~`OPENAI_API_KEY`~~ / ~~`AI_GATEWAY_API_KEY`~~ (unless you switch away from Gemini)

> Variables starting with `NEXT_PUBLIC_` are exposed to the browser — that's
> intentional for Supabase URL/anon key. Never put secret keys in `NEXT_PUBLIC_`.

### Step 4 — Redeploy

After saving env vars: **Deployments → … → Redeploy** (or push a new commit).

### Step 5 — Update Supabase for production URL

In Supabase dashboard → **Authentication → URL Configuration**:

| Field | Value |
|-------|-------|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | `https://your-app.vercel.app/**` |

Save. This lets sign-up / sign-in work on the live site.

### Step 6 — Test production

1. Open `https://your-app.vercel.app`
2. Pick a cup → **Serve My Cup** (works without login, 3/day)
3. **Sign up** → secret menu unlocks (Love, Roast, Fortune)

---

## Environment variables cheat sheet

### Local (`.env.local`)

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
# GEMINI_MODEL=gemini-3.5-flash
```

### Production (Vercel → Settings → Environment Variables)

Same keys, but `NEXT_PUBLIC_SITE_URL` = your real Vercel URL.

---

## How access works

| Visitor | Free cups | Secret menu | Daily limit |
|---------|-----------|-------------|-------------|
| Guest | Yes | Locked | 3/day (browser) |
| Member (signed up) | Yes | Unlocked | Unlimited |

---

## Troubleshooting

**Cup fails with 500**
- Check `GOOGLE_GENERATIVE_AI_API_KEY` is set in Vercel env vars and redeploy.
- Use `GEMINI_MODEL=gemini-3.5-flash` (older 2.0 models are shut down).

**Sign up fails on production**
- Supabase **Site URL** must match your Vercel URL exactly.
- Add `https://your-app.vercel.app/**` to **Redirect URLs**.

**Member perks not unlocking**
- Re-run `supabase/schema.sql`, then sign out and back in.

**Works locally but not on Vercel**
- Env vars only apply after redeploy.
- Check Vercel **Deployments → Logs** for errors.
