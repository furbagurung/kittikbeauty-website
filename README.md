# Kittik Beauty Website

This folder is only the public customer-facing website/storefront for Kittik Beauty.

The website is built as a Next.js storefront for browsing beauty products, categories, brands, reels, banners, and makeup services. It does not contain the admin dashboard or the Express server.

## Project Role

Path:

```text
D:\Coding\kittikbeauty-website
```

Purpose:

This is the public customer-facing Kittik Beauty website/storefront.

Run command:

```bash
npm run dev
```

Use this folder only for homepage, product listing UI, product detail UI, category pages, makeup service page, customer search UI, header/navbar/footer, SEO pages, and public website design or branding.

Do not put backend server or admin panel changes inside this folder.

## Workspace Roles

```text
D:\Coding\kittikbeauty-website         Customer Website Frontend
D:\Coding\kittik-backend               Backend Server
D:\Coding\kittik-backend\admin         Admin Panel Frontend
```

Use this project when changing the public website experience: homepage, product listing UI, product detail UI, category pages, brand pages, makeup service page, customer search UI, header/navbar/footer, SEO pages, and public website design or branding.

The backend project contains both:

1. Backend server at `D:\Coding\kittik-backend`, run with `npm run dev:server`.
2. Admin panel frontend at `D:\Coding\kittik-backend\admin`, run with `cd D:\Coding\kittik-backend\admin` and then `npm run dev`.

Use `D:\Coding\kittik-backend` for Express API routes, Prisma/database logic, authentication backend, product/category/brand/subcategory APIs, order/payment APIs, uploads handling, and server-side backend logic.

Use `D:\Coding\kittik-backend\admin` for admin dashboard UI, product/category/brand/subcategory management UI, order management UI, banner management UI, admin login/session UI, and shadcn admin components.

## Workspace Boundaries

Always check whether the requested task is for the public customer website, backend API/server, or admin dashboard frontend before editing files.

- Customer storefront changes must be done inside `D:\Coding\kittikbeauty-website`.
- Backend server changes must be done inside `D:\Coding\kittik-backend`.
- Admin frontend changes must be done inside `D:\Coding\kittik-backend\admin`.
- Do not edit backend/API files for website UI tasks.
- Do not edit website frontend files for backend/API tasks.
- Do not edit customer website files when the task is admin dashboard related.
- Do not put backend or admin panel changes inside this folder.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/Radix-style UI primitives
- `next/image` for optimized images

## Brand Direction

Kittik Beauty should feel premium, clean, minimal, Korean beauty inspired, SEO-focused, mobile-first, fast-loading, and conversion-focused.

Brand colors:

- Deep Luxury Green: `#00451F`
- Dark Emerald: `#003818`
- Warm Muted Gold: `#D6B253`
- Soft Gold: `#F3E7C3`
- Soft Cream Background: `#FAF7F0`
- White: `#FFFFFF`
- Rich Text: `#111111`
- Muted Text: `#5F5F5F`

The real logo is stored at:

```text
public/images/kittik-logo.png
```

## Environment

Create `.env.local` for local configuration.

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_API_URL` should point to the Express API in `D:\Coding\kittik-backend`.

## Scripts

Install dependencies:

```bash
npm install
```

Run the storefront locally:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint:

```bash
npm run lint
```

## Important Paths

```text
src/app/                 Next.js pages and route segments
src/components/layout/   Site header, footer, mobile navigation, search
src/components/home/     Homepage sections
src/components/products/ Product cards, listings, detail UI
src/components/catalog/  Category and brand catalog cards
src/lib/api.ts           Storefront API fetch/normalization layer
src/types/               Storefront TypeScript types
public/images/           Public image assets, including the real logo
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the project structure and how this frontend connects to the backend/admin project.
