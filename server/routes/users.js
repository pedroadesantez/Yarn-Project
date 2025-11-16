const { read, write, nextId } = require('../lib/db');
const { parseJSON, send } = require('../lib/http');
const { hashPassword, verifyPassword, createSession, getSession, destroySession } = require('../lib/auth');

function ensureUserStore() {
  const users = read('users');
  if (!users) {
    write('users', []);
  }
}

async function register(req, res) {
  ensureUserStore();
  const data = await parseJSON(req);
  if (!data || !data.email || !data.password || !data.name) return send(res, 400, { error: 'Missing fields' });
  const users = read('users', []);
  if (users.some(u => u.email.toLowerCase() === data.email.toLowerCase())) return send(res, 409, { error: 'Email exists' });
  const user = {
    id: nextId(users),
    email: data.email.trim().toLowerCase(),
    name: data.name.trim(),
    password: hashPassword(data.password),
    role: 'user',
    profile: { address: '', phone: '', avatar: '' },
    wishlist: [],
    cart: [],
    createdAt: Date.now()
  };
  users.push(user);
  write('users', users);
  return send(res, 201, { id: user.id, email: user.email, name: user.name });
}

async function login(req, res) {
  const data = await parseJSON(req);
  const users = read('users', []);
  const user = users.find(u => u.email.toLowerCase() === (data.email || '').toLowerCase());
  if (!user || !verifyPassword(data.password || '', user.password)) return send(res, 401, { error: 'Invalid credentials' });
  const { cookie, record } = createSession(user.id, user.role);
  res.setHeader('Set-Cookie', `sid=${encodeURIComponent(cookie)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=259200`);
  return send(res, 200, { id: user.id, email: user.email, name: user.name, role: user.role, session: { expiresAt: record.expiresAt } });
}

async function logout(req, res, sessionCookie) {
  destroySession(sessionCookie);
  res.setHeader('Set-Cookie', `sid=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0`);
  return send(res, 200, { ok: true });
}

async function me(req, res, session) {
  const users = read('users', []);
  const user = users.find(u => u.id === session.userId);
  if (!user) return send(res, 404, { error: 'Not found' });
  return send(res, 200, { id: user.id, email: user.email, name: user.name, role: user.role, profile: user.profile, wishlist: user.wishlist||[], cartCount: (user.cart||[]).reduce((s,i)=>s+i.qty,0) });
}

async function updateProfile(req, res, session) {
  const data = await parseJSON(req);
  const users = read('users', []);
  const idx = users.findIndex(u => u.id === session.userId);
  if (idx === -1) return send(res, 404, { error: 'Not found' });
  users[idx].name = data.name ?? users[idx].name;
  users[idx].profile = { ...users[idx].profile, ...data.profile };
  if (data.password) users[idx].password = hashPassword(data.password);
  write('users', users);
  return send(res, 200, { ok: true });
}

module.exports = { register, login, logout, me, updateProfile };
