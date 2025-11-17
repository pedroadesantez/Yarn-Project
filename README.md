# Yarnly — Elegant Yarn eCommerce

This is a modern eCommerce site for yarn and accessories featuring a soft, cozy aesthetic. It includes a user-facing storefront and a fully featured admin dashboard.

**Tech Stack:**
- **Frontend:** React + Vite (runs on `:3000`)
- **Backend:** Node.js HTTP API (runs on `:8080`)
- **Storage:** JSON files (for simplicity)

## Quick Start

### Development Mode

You'll need to run both frontend and backend servers:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run dev
```
The backend API will start on `http://localhost:8080`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:3000` and open in your browser.

### Admin Access

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

```
Yarn-Project/
├── frontend/              React + Vite frontend
│   ├── src/
│   │   ├── pages/        Page components (Home, Shop, Product, etc.)
│   │   ├── components/   Reusable React components
│   │   ├── utils/        API client and utilities
│   │   ├── styles.css    Main stylesheet
│   │   └── App.jsx       Router setup
│   ├── public/           Static assets (images)
│   ├── package.json
│   └── vite.config.js    Vite config with proxy to backend
│
├── backend/              Node.js HTTP API server
│   ├── index.js         HTTP server + routing
│   ├── routes/          API route handlers (users, products, cart, orders, admin)
│   ├── lib/             Helpers (db, auth, http)
│   ├── data/            JSON data files (auto-created)
│   ├── config.json      Server configuration
│   └── package.json
│
└── public/              Legacy HTML files (to be migrated)
```

## API Integration

The frontend makes API calls to the backend through a proxy configured in `vite.config.js`. All `/api/*` requests are forwarded to `http://localhost:8080`.

Use the API client in your React components:
```javascript
import api from './utils/api'

// Example: Fetch products
const products = await api.products.list({ category: 'wool' })

// Example: Login
await api.auth.login({ email, password })
```

## Notes

- **HTML Migration:** The original HTML pages are in `/public`. Page components in `/frontend/src/pages` are placeholders ready for you to migrate the HTML content to React.
- **Database:** This demo uses JSON files in `backend/data`. For production, swap to a real database.
- **Payments:** Mock payments by default. Configure real payment keys via Admin → Settings.
- **Admin Config:** To change the default admin credentials, edit `backend/config.json` before first run.
- **CORS:** The backend is configured to allow requests from `http://localhost:3000`.

