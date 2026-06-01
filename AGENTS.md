# Kittik Beauty Website – ChatGPT / Codex Instructions

## Project Context

This project is the official website for **Kittik Beauty**, a premium beauty and cosmetics brand.

The website should feel:

- Premium
- Clean
- Minimal
- Korean beauty inspired
- SEO-focused
- Mobile-first
- Fast-loading
- Conversion-focused

The brand colors are:

- Deep Luxury Green
- Warm Muted Gold
- White / Soft neutral backgrounds

The real logo is located at:

```txt
public/images/kittik-logo.png
```

## Required Reading Before Changes

Before making code, documentation, styling, API, admin, backend, or architecture changes in this workspace, read:

- `README.md`
- `ARCHITECTURE.md`
- `D:\Coding\kittik-backend\README.md`
- `D:\Coding\kittik-backend\ARCHITECTURE.md`

This folder, `D:\Coding\kittikbeauty-website`, is only the public storefront frontend. The sibling folder, `D:\Coding\kittik-backend`, contains both the Express backend server and the admin panel frontend.

## Project Role

Path:

```txt
D:\Coding\kittikbeauty-website
```

Purpose:

This is the public customer-facing Kittik Beauty website/storefront.

Run command:

```bash
npm run dev
```

Use this folder only for:

- homepage
- product listing UI
- product detail UI
- category pages
- makeup service page
- customer search UI
- header/navbar/footer
- SEO pages
- public website design and branding

Do not put backend server or admin panel changes inside this folder.

## Workspace Boundaries

Always identify the correct workspace before editing files:

- Customer storefront changes must be done inside `D:\Coding\kittikbeauty-website`.
- Backend server changes must be done inside `D:\Coding\kittik-backend`.
- Admin frontend changes must be done inside `D:\Coding\kittik-backend\admin`.
- Do not edit backend/API files for website UI tasks.
- Do not edit website frontend files for backend/API tasks.
- Do not edit customer website files when the task is admin dashboard related.

The backend project contains both:

1. Backend server at `D:\Coding\kittik-backend`, run with `npm run dev:server`.
2. Admin panel frontend at `D:\Coding\kittik-backend\admin`, run with `cd D:\Coding\kittik-backend\admin` and then `npm run dev`.

For Next.js code changes, also read the relevant guide in `node_modules/next/dist/docs/` before writing code because this project uses a Next.js version with breaking API and convention changes.
