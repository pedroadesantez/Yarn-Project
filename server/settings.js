const { read, write } = require('./lib/db');

function get(){
  return read('settings', {
    shippingRate: 6.99,
    paymentMode: 'mock',
    homepage: { heroTagline: 'Beautiful yarns for cozy creations' }
  });
}

function set(next){
  const current = get();
  const merged = { ...current, ...next };
  write('settings', merged);
  return merged;
}

module.exports = { get, set };

