# Project Restructure Summary

## What Was Done

The Yarn-Project has been successfully restructured from a monolithic application to a proper frontend/backend separation.

### Changes Made

1. **Backend Directory** (`/backend`)
   - Moved all server files from `/server` to `/backend`
   - Added `package.json` with `cors` dependency
   - Updated `index.js` to include CORS headers for frontend communication
   - Configured to run on port `:8080`
   - Script: `npm run dev`

2. **Frontend Directory** (`/frontend`)
   - Created new React + Vite application
   - Installed React Router for client-side routing
   - Set up proxy configuration to forward `/api/*` to backend
   - Created page components for all routes (Home, Shop, Product, Cart, etc.)
   - Migrated CSS (`styles.css`) and images to frontend
   - Created comprehensive API client utility (`src/utils/api.js`)
   - Configured to run on port `:3000`
   - Script: `npm run dev`

3. **Project Structure**
   ```
   Yarn-Project/
   ├── frontend/         React + Vite (port 3000)
   ├── backend/          Node.js API (port 8080)
   ├── public/           Legacy HTML files (to migrate)
   └── README.md         Updated documentation
   ```

## How to Run

### First Time Setup

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Daily Development

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
> Server runs on http://localhost:8080

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
> Frontend runs on http://localhost:3000 and opens automatically

## How It Works

1. **Frontend → Backend Communication:**
   - Vite proxy forwards all `/api/*` requests to `http://localhost:8080`
   - No need to specify full URLs in your API calls
   - CORS is configured on backend to accept requests from frontend

2. **API Client Usage:**
   ```javascript
   import api from './utils/api'

   // Fetch products
   const products = await api.products.list()

   // Login
   await api.auth.login({ email, password })

   // Add to cart
   await api.cart.add({ productId: 1, quantity: 2, color: 'blue' })
   ```

3. **Routing:**
   - All routes are defined in `frontend/src/App.jsx`
   - React Router handles client-side navigation
   - Pages are in `frontend/src/pages/`

## Next Steps (HTML Migration)

The placeholder page components are ready for you to migrate HTML content from `/public/*.html` files. For each page:

1. Open the original HTML file in `/public` (e.g., `shop.html`)
2. Open the React component in `/frontend/src/pages` (e.g., `Shop.jsx`)
3. Convert the HTML structure to JSX
4. Convert inline JavaScript to React hooks and state
5. Use the `api` client for backend calls
6. Add any new components to `/frontend/src/components`

## Key Files

- **Backend Config:** `backend/config.json` - Server settings, admin defaults, payment keys
- **Vite Config:** `frontend/vite.config.js` - Dev server port and proxy settings
- **API Client:** `frontend/src/utils/api.js` - All backend API methods
- **Router:** `frontend/src/App.jsx` - Route definitions
- **Styles:** `frontend/src/styles.css` - Main stylesheet

## Notes

- Original HTML files remain in `/public` for reference during migration
- Backend API endpoints remain unchanged
- Session cookies work across frontend/backend due to CORS credentials
- Images are now in `/frontend/public/images`
