# Service Inventory (Starter Build)

This zip is a **fresh v0.1 starter** for the new Quad2 Electric inventory app direction.

## What’s included (v0.1)
- React + TypeScript + Vite
- Supabase client (persistence when env vars are set)
- Owner **Setup & Branding** (company name + 3 colors)
- Warehouse Manager **Purchase Order builder** with:
  - Save to Supabase (tables included)
  - Printable template (Print/Save as PDF)
  - **Email stub via mailto** (one-click emailing via Edge Function is the next step)
- Role switcher (top right) for rapid UI testing

## Purchase Order Template: what the app needs
The template in this build supports:
- Vendor name (required)
- Vendor email (optional)
- Job/Project number (optional)
- Line items: part # (optional), description, qty, unit
- Notes (optional)

Next (when we add “real send”):
- A Supabase Edge Function that emails the generated PDF/HTML to the vendor using SendGrid/Resend.

## Supabase setup
1. Create a Supabase project.
2. In Supabase SQL Editor, run:
   - `supabase/migrations/0001_init.sql`
3. In Supabase Project Settings → API, copy:
   - Project URL
   - Anon public key
4. Create `.env` locally from `.env.example` and fill:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

## Local development
```bash
npm install
npm run dev
```

## Netlify deployment
1. Push this project to GitHub.
2. In Netlify, “New site from Git” → select repo.
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. In Netlify → Site settings → Environment variables, set:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy.

## Notes
- RLS policies in `0001_init.sql` are open for fast prototyping. Tighten later by adding `company_id` + authenticated policies.
- The next build step is to implement the full workflows we designed:
  - Technician job completion (materials used + signature)
  - SM inbox approve/return
  - WM restock + wire threshold queue
  - Project kitting + mixed “used from truck vs kit” reconciliation
  - Tool borrowing with dual signatures
  - Owner reports backed by real data
