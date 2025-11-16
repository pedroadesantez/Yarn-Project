# Yarnly — Elegant Yarn eCommerce (No Frameworks)

This is a modern, lightweight eCommerce site for yarn and accessories featuring a soft, cozy aesthetic. It includes a user-facing storefront and a fully featured admin dashboard. It runs on Node.js `http` (no external packages) with JSON file storage for simplicity.

## Quick Start

1. Ensure Node.js 18+ is installed.
2. Run: `npm start`
3. Open: `http://localhost:8080`

Admin login is auto-bootstrapped on first run:
- Email: `admin@yarnly.local`
- Password: `Admin@123`

## Features

- Storefront: registration/login, profile, product browsing with categories & filters, search, product detail with variants, stock, reviews, related items, wishlist, cart, checkout, order tracking, newsletter (mock), blog, FAQs, contact, about page.
- Payments: Mock payments by default. Switch mode via Admin → Settings. Keys are stored in `server/config.json` (non-functional in mock mode).
- Admin: analytics (revenue, sales, low-stock), products CRUD, categories, coupons, orders with status updates, users list, blog posts, settings (shipping rate, payment mode).
- Security: PBKDF2 password hashing, signed HttpOnly cookie sessions, role-based access control for admin APIs.
- SEO: clean URLs, metadata, `robots.txt`, `sitemap.xml`.
- Performance: no frameworks, minimal CSS/JS, HTTP caching disabled during dev.

## Project Structure

- `server/index.js` — HTTP server + routing
- `server/routes/*` — API route handlers
- `server/lib/*` — helpers (db, auth, http)
- `server/data/*.json` — JSON data files (auto-created)
- `public/*` — static frontend (storefront + admin)

## Notes

- This demo uses JSON files in `server/data`. For production, swap to a real DB and real payment SDKs.
- To change the default admin, edit `server/config.json` before first run.

