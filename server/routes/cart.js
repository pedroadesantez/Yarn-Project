const { read, write } = require('../lib/db');
const { parseJSON, send } = require('../lib/http');

function getCart(userId) {
  const users = read('users', []);
  const user = users.find(u => u.id === userId);
  return user?.cart || [];
}

function setCart(userId, cart) {
  const users = read('users', []);
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  users[idx].cart = cart;
  write('users', users);
  return true;
}

function addToWishlist(userId, productId) {
  const users = read('users', []);
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  const ws = new Set(users[idx].wishlist || []);
  ws.add(productId);
  users[idx].wishlist = Array.from(ws);
  write('users', users);
  return true;
}

function removeFromWishlist(userId, productId) {
  const users = read('users', []);
  const idx = users.findIndex(u => u.id === userId);
  if (idx === -1) return false;
  users[idx].wishlist = (users[idx].wishlist||[]).filter(id => id !== productId);
  write('users', users);
  return true;
}

async function add(req, res, userId) {
  const data = await parseJSON(req);
  const cart = getCart(userId);
  const existing = cart.find(i => i.productId === data.productId && i.variant === (data.variant||''));
  if (existing) existing.qty += Number(data.qty||1);
  else cart.push({ productId: data.productId, variant: data.variant||'', qty: Number(data.qty||1) });
  setCart(userId, cart);
  return send(res, 200, { cart });
}

function view(req, res, userId) {
  const cart = getCart(userId);
  return send(res, 200, { cart });
}

async function update(req, res, userId) {
  const data = await parseJSON(req);
  setCart(userId, data.cart || []);
  return send(res, 200, { cart: data.cart || [] });
}

async function wishlistAdd(req, res, userId) {
  const data = await parseJSON(req);
  addToWishlist(userId, data.productId);
  return send(res, 200, { ok: true });
}

async function wishlistRemove(req, res, userId) {
  const data = await parseJSON(req);
  removeFromWishlist(userId, data.productId);
  return send(res, 200, { ok: true });
}

module.exports = { add, view, update, wishlistAdd, wishlistRemove };

