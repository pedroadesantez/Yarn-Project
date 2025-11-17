const { URL } = require('url');

function parseJSON(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve(null);
      }
    });
  });
}

function send(res, status, data, headers = {}) {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  const base = { 'Content-Type': typeof data === 'string' ? 'text/plain' : 'application/json' };
  res.writeHead(status, { ...base, ...headers });
  res.end(content);
}

function parseCookies(req) {
  const jar = {};
  const raw = req.headers['cookie'];
  if (!raw) return jar;
  raw.split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) jar[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1));
  });
  return jar;
}

function urlInfo(req) {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const parts = u.pathname.split('/').filter(Boolean);
  return { url: u, path: u.pathname, parts, query: Object.fromEntries(u.searchParams) };
}

module.exports = { parseJSON, send, parseCookies, urlInfo };

