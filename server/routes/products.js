const { read, write, nextId } = require('../lib/db');
const { parseJSON, send } = require('../lib/http');

function ensureStores() {
  if (!read('products')) write('products', []);
  if (!read('categories')) write('categories', []);
  if (!read('reviews')) write('reviews', []);
}

function list(req, res, query) {
  ensureStores();
  const items = read('products', []);
  let filtered = items.filter(p => p.active !== false);
  if (query.q) {
    const q = query.q.toLowerCase();
    filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || (p.description||'').toLowerCase().includes(q));
  }
  if (query.category) filtered = filtered.filter(p => p.category === query.category);
  if (query.color) filtered = filtered.filter(p => p.colors?.includes(query.color));
  if (query.weight) filtered = filtered.filter(p => String(p.weight) === String(query.weight));
  if (query.length) filtered = filtered.filter(p => String(p.length) === String(query.length));
  if (query.minPrice) filtered = filtered.filter(p => p.price >= Number(query.minPrice));
  if (query.maxPrice) filtered = filtered.filter(p => p.price <= Number(query.maxPrice));
  return send(res, 200, { items: filtered });
}

function detail(req, res, id) {
  ensureStores();
  const items = read('products', []);
  const prod = items.find(p => p.id === id);
  if (!prod) return send(res, 404, { error: 'Not found' });
  const reviews = read('reviews', []).filter(r => r.productId === id);
  return send(res, 200, { ...prod, reviews });
}

async function addReview(req, res, id, userId) {
  const data = await parseJSON(req);
  const items = read('products', []);
  const prod = items.find(p => p.id === id);
  if (!prod) return send(res, 404, { error: 'Invalid product' });
  const reviews = read('reviews', []);
  const review = { id: nextId(reviews), productId: id, userId, rating: Math.max(1, Math.min(5, Number(data.rating||0))), text: data.text||'', createdAt: Date.now() };
  reviews.push(review);
  write('reviews', reviews);
  return send(res, 201, review);
}

module.exports = { list, detail, addReview };

