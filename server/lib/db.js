const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

function filePath(name) {
  ensureDir();
  return path.join(dataDir, `${name}.json`);
}

function read(name, fallback) {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return fallback ?? null;
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return JSON.parse(raw || 'null');
  } catch (e) {
    console.error('DB read error', name, e);
    return fallback ?? null;
  }
}

function write(name, value) {
  const fp = filePath(name);
  const tmp = `${fp}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2));
  fs.renameSync(tmp, fp);
}

function nextId(collection) {
  let max = 0;
  for (const item of collection) {
    if (typeof item.id === 'number') max = Math.max(max, item.id);
  }
  return max + 1;
}

module.exports = { read, write, nextId };

