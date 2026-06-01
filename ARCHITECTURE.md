# Kittik Beauty Website Architecture

This project is only the public customer-facing Kittik Beauty website/storefront frontend. It does not contain backend server code or the admin panel frontend.

Run this storefront with:

```bash
npm run dev
```

## Workspace Map

```text
D:\Coding\kittikbeauty-website
  Customer Website Frontend.
  Purpose: public customer-facing Kittik Beauty website/storefront.
  Run: npm run dev

D:\Coding\kittik-backend
  Backend Server plus admin project root.
  Purpose: Express backend server/API for Kittik Beauty.
  Backend run: npm run dev:server

D:\Coding\kittik-backend\admin
  Admin Panel Frontend.
  Purpose: admin dashboard frontend inside the backend project.
  Run: cd D:\Coding\kittik-backend\admin && npm run dev
```

The backend project contains both the backend server at `D:\Coding\kittik-backend` and the admin panel frontend at `D:\Coding\kittik-backend\admin`.

## Workspace Boundaries

Always check whether the requested task is for the public customer website, backend API/server, or admin dashboard frontend before editing files.

- Customer storefront changes must be done inside `D:\Coding\kittikbeauty-website`.
- Backend server changes must be done inside `D:\Coding\kittik-backend`.
- Admin frontend changes must be done inside `D:\Coding\kittik-backend\admin`.
- Do not edit backend/API files for website UI tasks.
- Do not edit website frontend files for backend/API tasks.
- Do not edit customer website files when the task is admin dashboard related.
- Do not put backend or admin panel changes inside `D:\Coding\kittikbeauty-website`.

## Frontend Boundary

`kittikbeauty-website` owns the customer-facing website:

- homepage and marketing sections
- product listing and product detail pages
- category and brand pages
- makeup service page
- public SEO metadata
- public responsive header, footer, mobile navigation, and search
- public brand styling and logo usage

It should not contain admin screens, API controllers, Prisma schema changes, auth middleware, or upload handling.

## Backend/Admin Boundary

`D:\Coding\kittik-backend` owns the backend server:

- Express API server
- Prisma data model and database access
- admin authentication
- product, category, brand, banner, reel, order, and customer management
- media uploads

`D:\Coding\kittik-backend\admin` owns the admin dashboard frontend:

- admin dashboard UI
- product management UI
- category/brand/subcategory management UI
- order management UI
- banner management UI
- admin login/session UI
- shadcn admin components

## Runtime Flow

```text
Customer browser
  -> kittikbeauty-website Next.js storefront
  -> NEXT_PUBLIC_API_URL
  -> kittik-backend Express API
  -> Prisma
  -> MariaDB/MySQL database

Admin browser
  -> kittik-backend/admin Next.js dashboard
  -> kittik-backend Express API
  -> Prisma
  -> MariaDB/MySQL database
```

## Storefront Structure

```text
src/app/
  layout.tsx                       Root app shell and metadata
  page.tsx                         Homepage
  makeup/page.tsx                  Makeup services page
  products/page.tsx                Product listing
  products/[id]/page.tsx           Product detail
  products/categories/             Category routes
  products/brands/                 Brand routes

src/components/layout/
  site-header.tsx                  Public header and desktop category nav
  mobile-navigation.tsx            Mobile drawer and bottom nav
  header-search.tsx                Search entry and mobile search overlay
  site-footer.tsx                  Public footer

src/components/home/
  banner-carousel.tsx              Homepage banners
  reel-section.tsx                 Beauty highlights/reels
  category-section.tsx             Category carousel
  product-carousel-section.tsx     Product rows
  brand-section.tsx                Brand carousel
  makeup-home-banner.tsx           Makeup CTA
  trust-badges.tsx                 Trust badges
  brand-story.tsx                  Brand story cards

src/components/products/
  product-card.tsx                 Shared product card
  product-listing-client.tsx       Search/filter/sort listing UI
  product-detail-actions.tsx       WhatsApp buy/ask actions
  product-detail-gallery.tsx       Product image gallery

src/lib/
  api.ts                           Public API client and response normalizers
  category-utils.ts                Slug and category matching helpers
  product-utils.ts                 Product href, price, stock helpers
  whatsapp.ts                      WhatsApp link helpers

public/images/
  kittik-logo.png                  Real brand logo
```

## Data Access

The storefront reads public data through `src/lib/api.ts`.

Default API base:

```text
https://kittikbeauty.com/api
```

Local development should set:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

The storefront normalizes backend responses for products, categories, sub-categories, brands, banners, and reels. Product/category/admin data mutations belong in `kittik-backend`, not this project.

## Styling System

Brand tokens live in `src/app/globals.css`.

Primary palette:

- `brandGreen`: `#00451F`
- `brandEmerald`: `#003818`
- `brandGold`: `#D6B253`
- `brandCream`: `#FAF7F0`

Use deep green for primary actions, muted gold for small accents, and white/soft cream for most surfaces.
