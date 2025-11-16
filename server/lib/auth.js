const crypto = require('crypto');
const { read, write } = require('./db');
const path = require('path');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${salt}$${hash}`;
}

function verifyPassword(password, saltedHash) {
  const [salt, hash] = saltedHash.split('$');
  const test = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(test, 'hex'));
}

function sign(value) {
  return crypto.createHmac('sha256', config.sessionSecret).update(value).digest('hex');
}

function createSession(userId, role) {
  const sessions = read('sessions', []);
  const token = crypto.randomBytes(24).toString('hex');
  const issuedAt = Date.now();
  const ttl = config.tokenTTLHours * 3600 * 1000;
  const record = { token, userId, role, issuedAt, expiresAt: issuedAt + ttl };
  sessions.push(record);
  write('sessions', sessions);
  const cookie = `${token}.${sign(token)}`;
  return { cookie, record };
}

function getSession(cookie) {
  if (!cookie) return null;
  const [token, signature] = cookie.split('.');
  if (!token || sign(token) !== signature) return null;
  const sessions = read('sessions', []);
  const rec = sessions.find(s => s.token === token);
  if (!rec) return null;
  if (rec.expiresAt < Date.now()) return null;
  return rec;
}

function destroySession(cookie) {
  if (!cookie) return;
  const [token] = cookie.split('.');
  const sessions = read('sessions', []);
  const next = sessions.filter(s => s.token !== token);
  write('sessions', next);
}

module.exports = { hashPassword, verifyPassword, createSession, getSession, destroySession };

