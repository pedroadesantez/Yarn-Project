const http = require('http');
const fs = require('fs');
const path = require('path');
const { urlInfo, send, parseCookies } = require('./lib/http');
const { getSession, createSession } = require('./lib/auth');
const { read, write } = require('./lib/db');

const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const adminRoute = require('./routes/admin');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

function bootstrapAdmin() {
  const users = read('users', []);
  const adminExists = users.some(u => u.role === 'admin');
  if (!adminExists) {
    const { hashPassword } = require('./lib/auth');
    users.push({ id: 1, email: config.adminDefault.email, name: config.adminDefault.name, password: hashPassword(config.adminDefault.password), role: 'admin', profile: {}, wishlist: [], cart: [], createdAt: Date.now() });
    write('users', users);
    console.log('Admin user created:', config.adminDefault.email, config.adminDefault.password);
  }
  if (!read('categories')) write('categories', [
    { id: 1, slug: 'wool', name: 'Wool' },
    { id: 2, slug: 'cotton', name: 'Cotton' },
    { id: 3, slug: 'acrylic', name: 'Acrylic' },
    { id: 4, slug: 'accessories', name: 'Accessories' }
  ]);
  if (!read('products')) write('products', [
    { id: 1, name: 'Soft Merino Wool', description: 'Luxurious merino wool yarn for premium projects.', price: 9.99, stock: 42, category: 'wool', colors: ['cream','beige','pastel-pink','soft-blue'], weight: 'DK', length: 100, images: ['/public/images/placeholder.svg'], active: true },
    { id: 2, name: 'Organic Cotton Blend', description: 'Breathable, gentle cotton blend perfect for baby garments.', price: 7.49, stock: 68, category: 'cotton', colors: ['white','pastel-pink','soft-blue'], weight: 'Worsted', length: 120, images: ['/public/images/placeholder.svg'], active: true },
    { id: 3, name: 'Everyday Acrylic', description: 'Durable acrylic yarn in versatile tones.', price: 3.99, stock: 120, category: 'acrylic', colors: ['cream','beige','gray'], weight: 'Aran', length: 90, images: ['/public/images/placeholder.svg'], active: true }
  ]);
}

function serveStatic(req, res, pathname) {
  const base = path.join(__dirname, '..');
  let rel = '';
  if (pathname === '/') rel = path.join('public', 'index.html');
  else if (pathname.startsWith('/public/')) rel = pathname.replace(/^\//, '');
  else rel = path.join('public', pathname.replace(/^\//, ''));
  const filePath = path.join(base, rel);
  if (!filePath.startsWith(base)) return send(res, 403, 'Forbidden');
  fs.readFile(filePath, (err, data) => {
    if (err) return send(res, 404, 'Not found');
    const ext = path.extname(filePath).toLowerCase();
    const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };
    res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control': 'no-cache' });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers for frontend on localhost:3000
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const { path: pathname, parts, query } = urlInfo(req);
  const cookies = parseCookies(req);
  const session = getSession(cookies.sid);

  if (parts[0] === 'api') {
    // Auth
    if (req.method === 'POST' && parts[1] === 'auth' && parts[2] === 'register') return usersRoute.register(req, res);
    if (req.method === 'POST' && parts[1] === 'auth' && parts[2] === 'login') return usersRoute.login(req, res);
    if (req.method === 'POST' && parts[1] === 'auth' && parts[2] === 'logout') return usersRoute.logout(req, res, cookies.sid);
    if (req.method === 'GET' && parts[1] === 'auth' && parts[2] === 'me') {
      if (!session) return send(res, 401, { error: 'Unauthorized' });
      return usersRoute.me(req, res, session);
    }
    if (req.method === 'PUT' && parts[1] === 'auth' && parts[2] === 'profile') {
      if (!session) return send(res, 401, { error: 'Unauthorized' });
      return usersRoute.updateProfile(req, res, session);
    }

    // Products
    if (req.method === 'GET' && parts[1] === 'products' && parts.length === 2) return productsRoute.list(req, res, query);
    if (req.method === 'GET' && parts[1] === 'products' && parts[2]) return productsRoute.detail(req, res, Number(parts[2]));
    if (req.method === 'POST' && parts[1] === 'products' && parts[2] && parts[3] === 'reviews') {
      if (!session) return send(res, 401, { error: 'Unauthorized' });
      return productsRoute.addReview(req, res, Number(parts[2]), session.userId);
    }

    // Cart & Wishlist
    if (!session && ['cart','wishlist'].includes(parts[1])) return send(res, 401, { error: 'Unauthorized' });
    if (req.method === 'GET' && parts[1] === 'cart') return cartRoute.view(req, res, session.userId);
    if (req.method === 'POST' && parts[1] === 'cart') return cartRoute.add(req, res, session.userId);
    if (req.method === 'PUT' && parts[1] === 'cart') return cartRoute.update(req, res, session.userId);
    if (req.method === 'POST' && parts[1] === 'wishlist') return cartRoute.wishlistAdd(req, res, session.userId);
    if (req.method === 'DELETE' && parts[1] === 'wishlist') return cartRoute.wishlistRemove(req, res, session.userId);

    // Orders
    if (!session && ['orders'].includes(parts[1])) return send(res, 401, { error: 'Unauthorized' });
    if (req.method === 'POST' && parts[1] === 'orders' && parts[2] === 'checkout') return ordersRoute.checkout(req, res, session.userId);
    if (req.method === 'POST' && parts[1] === 'orders' && parts[2] && parts[3] === 'pay') return ordersRoute.pay(req, res, session.userId, Number(parts[2]));
    if (req.method === 'GET' && parts[1] === 'orders' && parts.length === 2) return ordersRoute.listMine(req, res, session.userId);
    if (req.method === 'GET' && parts[1] === 'orders' && parts[2]) return ordersRoute.track(req, res, session.userId, Number(parts[2]));

    // Public Categories
    if (req.method === 'GET' && parts[1] === 'categories') return send(res, 200, { items: read('categories', []) });
    // Blog, FAQs, Posts
    if (req.method === 'GET' && parts[1] === 'posts' && parts.length === 2) return send(res, 200, { items: read('posts', []) });
    if (req.method === 'GET' && parts[1] === 'posts' && parts[2]) {
      const posts = read('posts', []);
      const post = posts.find(p => p.id === Number(parts[2]));
      if (!post) return send(res, 404, { error: 'Not found' });
      return send(res, 200, post);
    }
    if (req.method === 'GET' && parts[1] === 'faqs') return send(res, 200, { items: read('faqs', []) || [] });

    // Admin
    if (parts[1] === 'admin') {
      if (!session || session.role !== 'admin') return send(res, 403, { error: 'Forbidden' });
      if (req.method === 'GET' && parts[2] === 'analytics') return adminRoute.analytics(req, res);
      if (['POST','PUT'].includes(req.method) && parts[2] === 'products') return adminRoute.upsertProduct(req, res);
      if (req.method === 'DELETE' && parts[2] === 'products' && parts[3]) return adminRoute.deleteProduct(req, res, Number(parts[3]));
      if (['GET','POST'].includes(req.method) && parts[2] === 'categories') return adminRoute.categories(req, res);
      if (['GET','POST'].includes(req.method) && parts[2] === 'coupons') return adminRoute.coupons(req, res);
      if (['GET','POST'].includes(req.method) && parts[2] === 'posts') return adminRoute.blog(req, res);
      if (req.method === 'GET' && parts[2] === 'users') return adminRoute.users(req, res);
      if (req.method === 'GET' && parts[2] === 'orders') return adminRoute.orders(req, res);
      if (req.method === 'PUT' && parts[2] === 'orders' && parts[3]) return adminRoute.updateOrderStatus(req, res, Number(parts[3]));
      if (req.method === 'GET' && parts[2] === 'settings') return adminRoute.getSettings(req, res);
      if (req.method === 'PUT' && parts[2] === 'settings') return adminRoute.updateSettings(req, res);
      if (req.method === 'POST' && parts[2] === 'upload') return adminRoute.upload(req, res);
    }

    return send(res, 404, { error: 'Route not found' });
  }

  // Static files (storefront + admin)
  serveStatic(req, res, pathname);
});

bootstrapAdmin();

const port = Number(process.env.PORT || config.port);
server.listen(port, () => {
  const actual = server.address().port;
  console.log('Backend API server started');
  try {
    const runtime = { port: actual, startedAt: Date.now() };
    fs.writeFileSync(path.join(__dirname, 'runtime.json'), JSON.stringify(runtime, null, 2));
  } catch {}
});
