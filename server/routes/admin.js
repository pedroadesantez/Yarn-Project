const { read, write, nextId } = require('../lib/db');
const { parseJSON, send } = require('../lib/http');
const settings = require('../settings');
const fs = require('fs');
const path = require('path');

function requireAdmin(session) {
  return session && session.role === 'admin';
}

function analytics(req, res) {
  const orders = read('orders', []);
  const revenue = orders.filter(o => o.payment?.status === 'paid').reduce((s, o) => s + (o.totals?.total || 0), 0);
  const sales = orders.filter(o => o.payment?.status === 'paid').length;
  const products = read('products', []);
  const lowStock = products.filter(p => (p.stock||0) <= (read('inventory', {lowStockThreshold:5}).lowStockThreshold || 5)).map(p => ({ id: p.id, name: p.name, stock: p.stock||0 }));
  const byDay = {};
  for (const o of orders) {
    const d = new Date(o.createdAt).toISOString().slice(0,10);
    byDay[d] = byDay[d] || { sales: 0, revenue: 0 };
    if (o.payment?.status === 'paid') { byDay[d].sales++; byDay[d].revenue += (o.totals?.total || 0); }
  }
  return send(res, 200, { revenue, sales, byDay, lowStock });
}

async function upsertProduct(req, res) {
  const data = await parseJSON(req);
  const products = read('products', []);
  if (data.id) {
    const idx = products.findIndex(p => p.id === data.id);
    if (idx === -1) return send(res, 404, { error: 'Not found' });
    products[idx] = { ...products[idx], ...data };
  } else {
    data.id = nextId(products);
    data.active = true;
    products.push(data);
  }
  write('products', products);
  return send(res, 200, data);
}

function deleteProduct(req, res, id) {
  const products = read('products', []);
  const next = products.filter(p => p.id !== id);
  write('products', next);
  return send(res, 200, { ok: true });
}

async function categories(req, res) {
  const data = await parseJSON(req);
  const cats = read('categories', []);
  if (req.method === 'GET') return send(res, 200, { items: cats });
  if (req.method === 'POST') {
    if (!data || !data.slug || !data.name) return send(res, 400, { error: 'Missing fields' });
    if (cats.some(c => c.slug === data.slug)) return send(res, 409, { error: 'Exists' });
    cats.push({ id: nextId(cats), slug: data.slug, name: data.name });
    write('categories', cats);
    return send(res, 201, { ok: true });
  }
}

async function coupons(req, res) {
  const data = await parseJSON(req);
  const list = read('coupons', []);
  if (req.method === 'GET') return send(res, 200, { items: list });
  if (req.method === 'POST') {
    if (!data || !data.code || !data.type) return send(res, 400, { error: 'Missing fields' });
    data.id = nextId(list); data.active = true;
    list.push(data); write('coupons', list); return send(res, 201, data);
  }
}

async function blog(req, res) {
  const data = await parseJSON(req);
  const posts = read('posts', []);
  if (req.method === 'GET') return send(res, 200, { items: posts });
  if (req.method === 'POST') { data.id = nextId(posts); data.createdAt = Date.now(); posts.push(data); write('posts', posts); return send(res, 201, data); }
}

function users(req, res) {
  const users = read('users', []);
  return send(res, 200, { items: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role })) });
}

function orders(req, res) {
  const orders = read('orders', []);
  return send(res, 200, { items: orders });
}

async function updateOrderStatus(req, res, id) {
  const data = await parseJSON(req);
  const orders = read('orders', []);
  const idx = orders.findIndex(o => o.id === id);
  if (idx === -1) return send(res, 404, { error: 'Not found' });
  const next = data.status || orders[idx].status;
  if (next !== orders[idx].status) {
    orders[idx].status = next;
    orders[idx].timeline = orders[idx].timeline || [];
    orders[idx].timeline.push({ at: Date.now(), type: 'status', status: next, note: 'Status updated by admin' });
  }
  write('orders', orders);
  return send(res, 200, { ok: true });
}

module.exports = { requireAdmin, analytics, upsertProduct, deleteProduct, categories, coupons, blog, users, orders, updateOrderStatus };

async function getSettings(req, res){
  return send(res, 200, settings.get());
}

async function updateSettings(req, res){
  const data = await parseJSON(req);
  const next = settings.set(data||{});
  return send(res, 200, next);
}

module.exports.getSettings = getSettings;
module.exports.updateSettings = updateSettings;

// Simple base64/dataURL upload to public/uploads
function ensureUploads(){
  const dir = path.join(__dirname, '..', '..', 'public', 'uploads');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function upload(req, res){
  const data = await parseJSON(req);
  if (!data || !data.filename || !data.data) return send(res, 400, { error: 'Missing filename/data' });
  const dir = ensureUploads();
  let ext = path.extname(data.filename) || '.bin';
  const fn = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dest = path.join(dir, fn);
  const m = String(data.data).match(/^data:.+;base64,(.+)$/);
  const buf = Buffer.from(m ? m[1] : data.data, 'base64');
  fs.writeFileSync(dest, buf);
  return send(res, 201, { path: `/public/uploads/${fn}` });
}

module.exports.upload = upload;
