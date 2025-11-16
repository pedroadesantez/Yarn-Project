const { read, write, nextId } = require('../lib/db');
const { parseJSON, send } = require('../lib/http');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));

function computeTotals(cart, products, coupon) {
  let subtotal = 0;
  for (const item of cart) {
    const p = products.find(pp => pp.id === item.productId);
    if (!p) continue;
    subtotal += p.price * item.qty;
  }
  let discount = 0;
  if (coupon) {
    if (coupon.type === 'percent') discount = subtotal * (coupon.value / 100);
    if (coupon.type === 'amount') discount = coupon.value;
  }
  const settings = require('../settings').get();
  const shipping = settings.shippingRate ?? 6.99;
  const total = Math.max(0, subtotal - discount) + shipping;
  return { subtotal, discount, shipping, total };
}

async function checkout(req, res, userId) {
  const data = await parseJSON(req);
  const users = read('users', []);
  const products = read('products', []);
  const coupons = read('coupons', []);
  const user = users.find(u => u.id === userId);
  if (!user) return send(res, 400, { error: 'Invalid user' });
  const cart = user.cart || [];
  if (!cart.length) return send(res, 400, { error: 'Cart empty' });
  let coupon = null;
  if (data.coupon) coupon = coupons.find(c => c.code.toLowerCase() === data.coupon.toLowerCase() && c.active !== false);
  const totals = computeTotals(cart, products, coupon);
  const orders = read('orders', []);
  const order = {
    id: nextId(orders),
    userId,
    items: cart,
    totals,
    status: 'pending',
    timeline: [
      { at: Date.now(), type: 'status', status: 'pending', note: 'Order created' }
    ],
    payment: { method: data.method || 'mock', status: 'pending' },
    shippingAddress: data.shippingAddress || user.profile?.address || '',
    createdAt: Date.now()
  };
  orders.push(order);
  write('orders', orders);
  return send(res, 201, { orderId: order.id, payment: order.payment, totals });
}

async function pay(req, res, userId, orderId) {
  const orders = read('orders', []);
  const idx = orders.findIndex(o => o.id === orderId && o.userId === userId);
  if (idx === -1) return send(res, 404, { error: 'Order not found' });
  // Mock payment success
  orders[idx].payment.status = 'paid';
  orders[idx].timeline = orders[idx].timeline || [];
  orders[idx].timeline.push({ at: Date.now(), type: 'payment', status: 'paid', note: 'Payment confirmed' });
  orders[idx].status = 'processing';
  orders[idx].timeline.push({ at: Date.now(), type: 'status', status: 'processing', note: 'Order is being prepared' });
  // decrement stock
  const products = read('products', []);
  for (const item of orders[idx].items) {
    const p = products.find(pp => pp.id === item.productId);
    if (p) p.stock = Math.max(0, (p.stock || 0) - item.qty);
  }
  write('products', products);
  write('orders', orders);
  // clear user cart
  const users = read('users', []);
  const uidx = users.findIndex(u => u.id === userId);
  if (uidx !== -1) { users[uidx].cart = []; write('users', users); }
  return send(res, 200, { ok: true, status: orders[idx].status });
}

function listMine(req, res, userId) {
  const orders = read('orders', []);
  return send(res, 200, { items: orders.filter(o => o.userId === userId) });
}

function track(req, res, userId, orderId) {
  const orders = read('orders', []);
  const order = orders.find(o => o.id === orderId && o.userId === userId);
  if (!order) return send(res, 404, { error: 'Not found' });
  return send(res, 200, order);
}

module.exports = { checkout, pay, listMine, track };
