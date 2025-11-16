// Shared UI enhancements: nav state, toasts, mobile menu, cart count

function $(sel, root=document){ return root.querySelector(sel); }
function $all(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

async function fetchJSON(url, opts){
  const r = await fetch(url, opts);
  if (!r.ok) throw new Error((await r.text())||('HTTP '+r.status));
  const ct = r.headers.get('content-type')||'';
  return ct.includes('application/json') ? r.json() : r.text();
}

function ensureToastContainer(){
  let c = $('.toasts');
  if (!c){ c = document.createElement('div'); c.className='toasts'; document.body.appendChild(c); }
  return c;
}

function showToast(msg, type=''){
  const c = ensureToastContainer();
  const el = document.createElement('div');
  el.className = 'toast '+type;
  el.innerHTML = `<div style="font-size:18px">${type==='success'?'✓':'ℹ️'}</div><div>${msg}</div>`;
  c.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transform='translateY(10px)'; setTimeout(()=>el.remove(), 250); }, 2200);
}

async function initNav(){
  try {
    const me = await fetch('/api/auth/me').then(r=>r.ok?r.json():null);
    let cartCount = (me && me.cartCount) || 0;
    if (!me){
      try { const gc = JSON.parse(localStorage.getItem('guestCart')||'[]'); cartCount = gc.reduce((s,i)=>s+(i.qty||0),0); } catch {}
    }
    const cartEl = document.getElementById('cart-count');
    if (cartEl) cartEl.textContent = cartCount>0? `(${cartCount})` : '';
    const acct = document.getElementById('account-link');
    if (acct){
      acct.innerHTML = me ? `<a href="/profile.html">My Account</a> · <a id="logout" href="#">Logout</a>` : `<a href="/login.html">Sign In</a>`;
      const lo = document.getElementById('logout');
      if (lo) lo.onclick = async (e)=>{ e.preventDefault(); await fetch('/api/auth/logout',{method:'POST'}); location.reload(); };
    }
  } catch {}
}

function updateCartCount(n){ const el=document.getElementById('cart-count'); if(el) el.textContent = n>0?`(${n})`:''; }

function initMobileNav(){
  const burger = document.getElementById('hamburger');
  const sheet = document.getElementById('mobile-nav');
  if (burger && sheet){
    burger.addEventListener('click', ()=>sheet.classList.toggle('open'));
    sheet.addEventListener('click', (e)=>{ if (e.target.tagName==='A') sheet.classList.remove('open'); });
  }
}

function setCanonicalOgUrl(){
  try{
    const abs = location.origin + location.pathname + location.search;
    let link = document.querySelector('link[rel="canonical"]');
    if (link) link.href = abs; else { link = document.createElement('link'); link.rel='canonical'; link.href=abs; document.head.appendChild(link); }
    let og = document.querySelector('meta[property="og:url"]');
    if (og) og.setAttribute('content', abs); else { og=document.createElement('meta'); og.setAttribute('property','og:url'); og.setAttribute('content', abs); document.head.appendChild(og); }
  }catch{}
}

window.addEventListener('DOMContentLoaded', ()=>{ initNav(); initMobileNav(); setCanonicalOgUrl(); });

// expose minimal API for non-module scripts
window.showToast = showToast;
window.updateCartCount = updateCartCount;

// Mini cart drawer
let drawer, backdrop;
async function loadCartData(){
  const r = await fetch('/api/cart'); if(!r.ok) throw new Error('not-signed-in');
  const {cart} = await r.json();
  const prods = await fetch('/api/products').then(r=>r.json());
  const map = new Map(prods.items.map(p=>[p.id,p]));
  return {cart, map};
}

async function renderCartDrawer(){
  if (!drawer){
    backdrop = document.createElement('div'); backdrop.className='backdrop';
    drawer = document.createElement('aside'); drawer.className='drawer';
    document.body.append(backdrop, drawer);
    backdrop.addEventListener('click', closeDrawer);
  }
  drawer.innerHTML = `<div class="head"><strong>Your Cart</strong><button id="closeDrawer" class="pill">Close</button></div><div class="body" id="cartBody"></div><div class="foot"><div class="row"><div class="spacer"></div><a class="btn" href="/cart.html">View Cart</a></div></div>`;
  drawer.querySelector('#closeDrawer').onclick = closeDrawer;
  try {
    const {cart, map} = await loadCartData();
    let subtotal = 0;
    const body = drawer.querySelector('#cartBody');
    if (!cart.length){ body.innerHTML = '<div class="muted">Your cart is empty.</div>'; }
    else {
      body.innerHTML = cart.map((i,idx)=>{
        const p = map.get(i.productId) || {name:'Unknown',price:0,images:['/public/images/placeholder.svg']};
        subtotal += (p.price||0)*(i.qty||0);
        return `<div class="line"><img src="${(p.images&&p.images[0])||'/public/images/placeholder.svg'}" alt="${p.name}"><div class="grow"><div><strong>${p.name}</strong></div><div class="muted">${i.variant||''}</div></div><div class="qty">x${i.qty}</div><button class="remove" data-index="${idx}">Remove</button></div>`;
      }).join('');
      const foot = drawer.querySelector('.foot');
      const price = document.createElement('div'); price.className='muted'; price.style.marginBottom='8px'; price.textContent = `Subtotal: $${subtotal.toFixed(2)}`; foot.prepend(price);
      body.addEventListener('click', async (e)=>{
        if (e.target.classList.contains('remove')){
          const idx = Number(e.target.dataset.index);
          const {cart} = await loadCartData();
          cart.splice(idx,1);
          await fetch('/api/cart',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({cart})});
          renderCartDrawer();
          try{ const me=await fetch('/api/auth/me').then(r=>r.json()); updateCartCount(me.cartCount||0);}catch{}
        }
      });
    }
  } catch (e) {
    drawer.querySelector('#cartBody').innerHTML = '<div class="muted">Please sign in to view your cart.</div>';
  }
}

function openDrawer(){ backdrop?.classList.add('open'); drawer?.classList.add('open'); }
function closeDrawer(){ backdrop?.classList.remove('open'); drawer?.classList.remove('open'); }

window.addEventListener('DOMContentLoaded', ()=>{
  const cartLinks = Array.from(document.querySelectorAll('a[href="/cart.html"]'));
  cartLinks.forEach(a=>{
    a.addEventListener('click', async (e)=>{
      // open mini-cart instead of navigating
      e.preventDefault();
      await renderCartDrawer();
      openDrawer();
    });
  });
});
