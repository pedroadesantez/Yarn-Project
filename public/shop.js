function qs(k){return new URLSearchParams(location.search).get(k)}

// =============== SHOP PAGE ===============
async function populateShop(){
  const catSel=document.getElementById('category'); if(!catSel) return;
  const cats = await fetch('/api/categories',{method:'GET'}).then(r=>r.ok?r.json():{items:[]}).catch(()=>({items:[]}));
  (cats.items||[]).forEach(c=>{const o=document.createElement('option');o.value=c.slug;o.textContent=c.name;catSel.appendChild(o)});
  catSel.value = qs('category')||'';

  const chips = document.getElementById('chips');
  const sortSel = document.getElementById('sort');
  const loadMoreBtn = document.getElementById('loadMore');
  let currentItems = [];
  let visible = 8;

  function renderResults(){
    const sort = sortSel?.value || 'popular';
    const arr = currentItems.slice();
    if (sort==='price-asc') arr.sort((a,b)=>a.price-b.price);
    if (sort==='price-desc') arr.sort((a,b)=>b.price-a.price);
    if (sort==='newest') arr.sort((a,b)=>(b.id||0)-(a.id||0));
    const page = arr.slice(0, visible);
    const html = page.map(p=>`<a class="card wrap" href="/product.html?id=${p.id}">
      <div class="ribbon">${p.stock<10?'Low stock':'Bestseller'}</div>
      <img src="${(p.images&&p.images[0])||'/public/images/placeholder.svg'}" alt="${p.name}"><div class="pad"><div class="title">${p.name}</div><div class="muted">${(p.category||'').toString().replace(/^./,c=>c.toUpperCase())}</div><div class="price">$${p.price.toFixed(2)}</div></div>
      <div class="overlay"><div class="qty"><button data-qm>-</button><input data-qi value="1"><button data-qp>+</button></div><button class="btn-ghost" data-quick="${p.id}">Quick view</button><button class="btn" data-add="${p.id}">Add</button></div>
    </a>`).join('');
    const resultsEl = document.getElementById('results');
    resultsEl.innerHTML = html || '<div class="muted">No items match your filters.</div>';
    if (loadMoreBtn) loadMoreBtn.style.display = (visible < currentItems.length) ? 'inline-block' : 'none';
    resultsEl.onclick = async (e)=>{
      const qbtn = e.target.closest('[data-quick]');
      const abtn = e.target.closest('[data-add]');
      if (e.target.hasAttribute('data-qm')){ const input=e.target.parentElement.querySelector('[data-qi]'); input.value=Math.max(1,parseInt(input.value||'1',10)-1); }
      if (e.target.hasAttribute('data-qp')){ const input=e.target.parentElement.querySelector('[data-qi]'); input.value=Math.max(1,parseInt(input.value||'1',10)+1); }
      if (qbtn){ e.preventDefault(); e.stopPropagation(); openQuickView(Number(qbtn.dataset.quick)); }
      if (abtn){ e.preventDefault(); e.stopPropagation();
        try{
          const pid = Number(abtn.dataset.add);
          const card = abtn.closest('.card');
          const qty = parseInt(card.querySelector('[data-qi]')?.value||'1',10);
          const prod = currentItems.find(x=>x.id===pid) || await fetch('/api/products/'+pid).then(r=>r.json());
          const variant = (prod.colors&&prod.colors[0])||'';
          const resp = await fetch('/api/cart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:pid,variant,qty})});
          if(resp.ok){ if(window.showToast) showToast('Added to cart','success'); try{ const me=await fetch('/api/auth/me').then(r=>r.json()); updateCartCount(me.cartCount||0);}catch{} }
          else { try{ const gc = JSON.parse(localStorage.getItem('guestCart')||'[]'); gc.push({productId:pid,variant,qty}); localStorage.setItem('guestCart', JSON.stringify(gc)); updateCartCount(gc.reduce((s,i)=>s+i.qty,0)); if(window.showToast) showToast('Added to cart (saved for login)','success'); }catch{} }
        }catch(err){ console.error(err); }
      }
    };
  }

  const apply=()=>{
    const params={ q:document.getElementById('q').value.trim(), category:catSel.value, color:document.getElementById('color').value, weight:document.getElementById('weight').value, minPrice:document.getElementById('minPrice').value, maxPrice:document.getElementById('maxPrice').value };
    const qstr=Object.entries(params).filter(([,v])=>v).map(([k,v])=>`${k}=${encodeURIComponent(v)}`).join('&');
    history.replaceState(null,'','/shop.html'+(qstr?`?${qstr}`:''));
    chips.innerHTML = Object.entries(params).filter(([,v])=>v).map(([k,v])=>`<span class="chip">${k}: ${v} <button class="close" data-k="${k}">&times;</button></span>`).join('');
    chips.onclick = (e)=>{ const b=e.target.closest('.close'); if(!b) return; const k=b.dataset.k; const el=document.getElementById(k); if(el) el.value=''; if(k==='q'){ document.getElementById('q').value=''; } apply(); };
    fetch('/api/products'+(qstr?`?${qstr}`:''))
      .then(r=>r.json()).then(data=>{ currentItems = Array.isArray(data.items) ? data.items : []; visible=8; renderResults(); });
  };

  document.getElementById('apply').onclick=apply;
  ;['q','category','color','weight','minPrice','maxPrice'].forEach(id=>{ const el=document.getElementById(id); if (el) el.addEventListener('change', ()=>apply()); if (id==='q'&&el) el.addEventListener('keyup',(e)=>{ if(e.key==='Enter') apply(); }); });
  sortSel?.addEventListener('change', renderResults);
  loadMoreBtn?.addEventListener('click', ()=>{ visible += 8; renderResults(); });
  apply();
}

// =============== PRODUCT PAGE ===============
async function populateProduct(){
  const id = Number(qs('id')); if(!id) return;
  const p = await fetch('/api/products/'+id).then(r=>r.json());
  document.getElementById('name').textContent=p.name;
  document.getElementById('price').textContent=`$${p.price.toFixed(2)}`;
  document.getElementById('stock').textContent=`In stock: ${p.stock||0}`;
  document.getElementById('desc').textContent=p.description||'';
  const images=(p.images||['/public/images/placeholder.svg']);
  const main=document.getElementById('mainImg'); if(main){ main.src=images[0]; main.alt=p.name; }
  const mainWrap=document.getElementById('mainImage'); if(mainWrap){ mainWrap.addEventListener('click',()=>mainWrap.classList.toggle('zoom')); window.addEventListener('keydown',(e)=>{ if (!images||!images.length) return; const thumbs=document.getElementById('thumbs'); let i = images.findIndex(src=> (main?.src||'').endsWith(src)); if (e.key==='Escape') mainWrap.classList.remove('zoom'); if (e.key==='ArrowRight'){ i=(i+1)%images.length; if(main) main.src=images[i]; const t=thumbs?.querySelectorAll('img')[i]; thumbs?.querySelectorAll('img')?.forEach(x=>x.removeAttribute('aria-selected')); t?.setAttribute('aria-selected','true'); } if (e.key==='ArrowLeft'){ i=(i-1+images.length)%images.length; if(main) main.src=images[i]; const t=thumbs?.querySelectorAll('img')[i]; thumbs?.querySelectorAll('img')?.forEach(x=>x.removeAttribute('aria-selected')); t?.setAttribute('aria-selected','true'); } }); }
  const thumbs=document.getElementById('thumbs'); if(thumbs){ thumbs.innerHTML=images.map((src,i)=>`<img src="${src}" data-i="${i}" ${i===0?'aria-selected="true"':''}>`).join(''); thumbs.addEventListener('click',(e)=>{ const t=e.target.closest('img'); if(!t) return; const i=Number(t.dataset.i); if(main) main.src=images[i]; Array.from(thumbs.querySelectorAll('img')).forEach(x=>x.removeAttribute('aria-selected')); t.setAttribute('aria-selected','true'); }); }
  const varSel=document.getElementById('variant'); if(varSel){ (p.colors||['default']).forEach(c=>{const o=document.createElement('option');o.value=c;o.textContent=c;o.style.textTransform='capitalize';varSel.appendChild(o)}); }
  const sw = document.getElementById('swatches'); if (sw){ sw.innerHTML = (p.colors||[]).map(c=>`<button class="swatch" data-c="${c}" title="${c}" style="background:${c.replace('pastel-','')}"></button>`).join(''); sw.addEventListener('click', (e)=>{ const b=e.target.closest('.swatch'); if(!b) return; Array.from(sw.querySelectorAll('.swatch')).forEach(x=>x.removeAttribute('aria-selected')); b.setAttribute('aria-selected','true'); if(varSel) varSel.value=b.dataset.c; }); const first = sw.querySelector('.swatch'); if(first){ first.setAttribute('aria-selected','true'); if(varSel) varSel.value=first.dataset.c; } }
  const rel = await fetch('/api/products?category='+encodeURIComponent(p.category)).then(r=>r.json());
  const relEl=document.getElementById('related'); if(relEl) relEl.innerHTML=rel.items.filter(x=>x.id!==p.id).slice(0,4).map(x=>`<a class="card" href="/product.html?id=${x.id}"><img src="${(x.images&&x.images[0])||'/public/images/placeholder.svg'}" alt="${x.name}"><div class="pad"><div>${x.name}</div><div class="price">$${x.price.toFixed(2)}</div></div></a>`).join('');
  // Recently viewed
  try{ const rv = JSON.parse(localStorage.getItem('recent')||'[]'); const set = new Set([p.id, ...rv]); const arr = Array.from(set).slice(0,8); localStorage.setItem('recent', JSON.stringify(arr)); const all = await fetch('/api/products').then(r=>r.json()); const items = arr.map(id=>all.items.find(x=>x.id===id)).filter(Boolean).filter(x=>x.id!==p.id).slice(0,4); const rec=document.getElementById('recent'); if(rec) rec.innerHTML=items.map(x=>`<a class="card" href="/product.html?id=${x.id}"><img src="${(x.images&&x.images[0])||'/public/images/placeholder.svg'}"><div class="pad"><div>${x.name}</div><div class="price">$${x.price.toFixed(2)}</div></div></a>`).join(''); }catch{}

  document.getElementById('dec')?.addEventListener('click',()=>{ const q=document.getElementById('qty'); q.value=Math.max(1, (parseInt(q.value||'1',10)-1)); });
  document.getElementById('inc')?.addEventListener('click',()=>{ const q=document.getElementById('qty'); q.value=Math.max(1, (parseInt(q.value||'1',10)+1)); });
  const add=document.getElementById('addToCart'); if(add) add.onclick=async()=>{
    const variant=varSel?.value||''; const qty=parseInt(document.getElementById('qty')?.value||'1',10);
    const r=await fetch('/api/cart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:p.id,variant,qty})});
    if(r.ok){ try{ const me=await fetch('/api/auth/me').then(r=>r.json()); if(me&&me.cartCount!==undefined) updateCartCount(me.cartCount); }catch{}; if(window.showToast) showToast('Added to cart','success'); } else { try{ const gc = JSON.parse(localStorage.getItem('guestCart')||'[]'); gc.push({productId:p.id,variant,qty}); localStorage.setItem('guestCart', JSON.stringify(gc)); updateCartCount(gc.reduce((s,i)=>s+i.qty,0)); if(window.showToast) showToast('Added to cart (saved for login)','success'); }catch{} }
  };
  const wish=document.getElementById('addToWishlist'); if(wish) wish.onclick=async()=>{ const r=await fetch('/api/wishlist',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:p.id})}); if(r.ok){ if(window.showToast) showToast('Added to wishlist','success'); } else alert('Please sign in first.'); };
  const submit=document.getElementById('submitReview'); if(submit) submit.onclick=async()=>{ const rating=Number(document.getElementById('rating').value); const text=document.getElementById('reviewText').value; const r=await fetch(`/api/products/${p.id}/reviews`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rating,text})}); if(r.ok) location.reload(); else alert('Please sign in to review.'); };

  // Sticky add bar (mobile)
  const mbDec=document.getElementById('mbDec'); const mbInc=document.getElementById('mbInc'); const mbQty=document.getElementById('mbQty'); const mbAdd=document.getElementById('mbAdd');
  mbDec?.addEventListener('click',()=>{ mbQty.value=Math.max(1,parseInt(mbQty.value||'1',10)-1)});
  mbInc?.addEventListener('click',()=>{ mbQty.value=Math.max(1,parseInt(mbQty.value||'1',10)+1)});
  mbAdd?.addEventListener('click', async ()=>{ const variant=varSel?.value||''; const qty=parseInt(mbQty?.value||'1',10); const r=await fetch('/api/cart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:p.id,variant,qty})}); if(r.ok){ try{ const me=await fetch('/api/auth/me').then(r=>r.json()); if(me&&me.cartCount!==undefined) updateCartCount(me.cartCount); }catch{}; if(window.showToast) showToast('Added to cart','success'); } else { try{ const gc = JSON.parse(localStorage.getItem('guestCart')||'[]'); gc.push({productId:p.id,variant,qty}); localStorage.setItem('guestCart', JSON.stringify(gc)); updateCartCount(gc.reduce((s,i)=>s+i.qty,0)); if(window.showToast) showToast('Added to cart (saved for login)','success'); }catch{} } });
}

// =============== CART PAGE ===============
async function populateCart(){
  const el=document.getElementById('cartItems'); if(!el) return;
  const r = await fetch('/api/cart');
  if(!r.ok){ el.innerHTML='<div class="muted">Please <a href="/login.html">sign in</a> to view your cart.</div>'; return; }
  const {cart}=await r.json();
  const prods=await fetch('/api/products').then(r=>r.json());
  let subtotal=0; el.innerHTML=cart.map(i=>{const p=prods.items.find(x=>x.id===i.productId)||{name:'Unknown',price:0,images:['/public/images/placeholder.svg']}; subtotal+=p.price*i.qty; return `<div class="card"><div class="pad" style="display:flex;align-items:center;gap:12px"><img src="${(p.images&&p.images[0])||'/public/images/placeholder.svg'}" style="width:80px;height:80px;object-fit:cover;border-radius:8px"><div style="flex:1"><div><strong>${p.name}</strong> <span class="muted">${i.variant||''}</span></div><div class="muted">Qty ${i.qty}</div></div><div class="price">$${(p.price*i.qty).toFixed(2)}</div></div></div>`}).join('');
  document.getElementById('totals').innerHTML = `<div class="card"><div class="pad"><div>Subtotal: $${subtotal.toFixed(2)}</div><div>Shipping: $6.99</div><div><strong>Total: $${(subtotal+6.99).toFixed(2)}</strong></div></div></div>`;
  document.getElementById('checkout').onclick=async()=>{
    const coupon=document.getElementById('coupon').value.trim(); const method=document.getElementById('method').value;
    const r=await fetch('/api/orders/checkout',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({coupon,method})});
    if(!r.ok){ if(window.showToast) showToast('Checkout failed','error'); return }
    const {orderId}=await r.json();
    const pay=await fetch(`/api/orders/${orderId}/pay`,{method:'POST'});
    if(pay.ok){ if(window.showToast) showToast('Payment successful','success'); setTimeout(()=>location.href='/shop.html',800);} else { if(window.showToast) showToast('Payment failed','error'); }
  };
}

// Boot
populateShop();
populateProduct();
populateCart();

// =============== Quick View Modal ===============
function ensureModal(){ let mb=document.querySelector('.modal-backdrop'); let modal=document.querySelector('.modal'); if(!mb){ mb=document.createElement('div'); mb.className='modal-backdrop'; document.body.appendChild(mb);} if(!modal){ modal=document.createElement('div'); modal.className='modal'; document.body.appendChild(modal);} mb.onclick=closeModal; return {mb,modal}; }

async function openQuickView(id){ const {mb,modal}=ensureModal(); const p=await fetch('/api/products/'+id).then(r=>r.json()); modal.innerHTML=`<div class="panel"><div class="head"><strong>${p.name}</strong><button class="pill" id="modalClose">Close</button></div><div class="body"><div class="split"><div><div class="main-image"><img src="${(p.images&&p.images[0])||'/public/images/placeholder.svg'}"></div><div class="muted" style="margin-top:6px">${p.description||''}</div></div><div><div class="price">$${p.price.toFixed(2)}</div><div style="margin:12px 0"><label class="muted" style="display:block;margin-bottom:6px">Color</label><select id="qvVariant" class="input select">${(p.colors||['default']).map(c=>`<option>${c}</option>`).join('')}</select></div><div class="row" style="margin:12px 0"><label class="muted">Qty</label><div class="qty"><button id="qvDec">-</button><input id="qvQty" value="1"><button id="qvInc">+</button></div></div><button class="btn" id="qvAdd">Add to cart</button></div></div></div>`; document.getElementById('modalClose').onclick=closeModal; document.getElementById('qvDec').onclick=()=>{const q=document.getElementById('qvQty'); q.value=Math.max(1,parseInt(q.value||'1',10)-1)}; document.getElementById('qvInc').onclick=()=>{const q=document.getElementById('qvQty'); q.value=Math.max(1,parseInt(q.value||'1',10)+1)}; document.getElementById('qvAdd').onclick=async ()=>{ const variant=document.getElementById('qvVariant').value; const qty=parseInt(document.getElementById('qvQty').value||'1',10); const r=await fetch('/api/cart',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({productId:id,variant,qty})}); if(r.ok){ if(window.showToast) showToast('Added to cart','success'); try{ const me=await fetch('/api/auth/me').then(r=>r.json()); updateCartCount(me.cartCount||0);}catch{}; closeModal(); } else alert('Please sign in first.'); }; mb.classList.add('open'); modal.classList.add('open'); }

function closeModal(){ const mb=document.querySelector('.modal-backdrop'); const modal=document.querySelector('.modal'); mb?.classList.remove('open'); modal?.classList.remove('open'); }
