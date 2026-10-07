/* BEARWICK: page behaviour (vanilla JS)
   Order: DATA -> helpers -> age gate -> flavours -> taste -> static lists -> shop -> cart -> init */

/* ================= DATA ================= */
const FLAVOURS = [
  { id:'blackcurrant', name:'Blackcurrant', color:'#8e5cd1', tag:'Dark. Fruity. Surprisingly refreshing.',
    desc:'The flagship, and the easiest way into stout. Smooth, dark and gently tart.',
    notes:['Smooth roasted malt','Light coffee and chocolate','Fresh blackcurrant','Gentle tartness','Clean finish'],
    profile:{Roast:4,Flavour:3,Tartness:3,Sweetness:2,Bitterness:2,Refreshing:4} },
  { id:'cherry', name:'Cherry', color:'#b3243b', tag:'Smooth. Rich. Easy to drink.',
    desc:'A lighter stout with subtle dark cherry and a dry finish.',
    notes:['Roasted malt','Soft chocolate','Dark cherry','Gentle sweetness','Dry finish'],
    profile:{Roast:3,Flavour:3,Tartness:2,Sweetness:3,Bitterness:2,Refreshing:3} },
  { id:'raspberry', name:'Raspberry', color:'#e0386f', tag:'Tart. Smooth. Refreshing.',
    desc:'Lighter and slightly tart, with a crisp finish.',
    notes:['Smooth roasted malt','Light cocoa','Fresh raspberry','Gentle acidity','Crisp finish'],
    profile:{Roast:3,Flavour:4,Tartness:4,Sweetness:2,Bitterness:2,Refreshing:4} },
  { id:'peanut', name:'Peanut Butter', color:'#d9a05b', tag:'Nutty. Smooth. Unexpected.', allergen:'Contains peanuts',
    desc:'A smooth, creamy stout with roasted peanut and light cocoa.',
    notes:['Smooth roasted malt','Light cocoa','Roasted peanut','Creamy body','Dry finish'],
    profile:{Roast:3,Flavour:4,Tartness:1,Sweetness:3,Bitterness:2,Refreshing:3} }
];
const ABV = '3.8%';
const PACKS = { single:{label:'Single can', price:2.75}, four:{label:'4-pack', price:9.75}, twelve:{label:'12-pack', price:26} };
const BUNDLES = [
  { id:'mixed12', name:'Mixed 12-Pack', price:27, main:true, desc:'Three of each flavour. The best way to find your favourite.' },
  { id:'discovery', name:'Discovery Box', price:30, desc:'Four flavours, plus the BEARWICK bear on the box.' }
];
const INGREDIENTS = ['Water','Pale malt','Roasted barley','Chocolate malt','Oats','Wheat','Hops','Yeast','Natural flavourings'];
const REVIEWS = [
  ['I normally walk past stout. This one I finished and went back for.','Sample, Blackcurrant'],
  ['Dark but not heavy. The cherry is there without being sweet.','Sample, Cherry'],
  ['Peanut butter and stout should not work. It really does.','Sample, Peanut Butter']
];

/* ================= HELPERS ================= */
const $ = (s) => document.querySelector(s);
const money = (n) => '£' + n.toFixed(2);
const state = { flavour: 'blackcurrant', compare: false };
const fl = (id) => FLAVOURS.find((f) => f.id === id);

// SVG can: dark body, bear mark, flavour name, and a Warwick Castle skyline in the flavour colour
function canSVG(f) {
  return `<svg viewBox="0 0 120 220" class="w-full h-auto" role="img" aria-label="BEARWICK ${f.name} stout can">
    <defs><linearGradient id="g-${f.id}" x1="0" x2="1"><stop offset="0" stop-color="#050404"/><stop offset=".45" stop-color="#26201f"/><stop offset="1" stop-color="#050404"/></linearGradient></defs>
    <rect x="18" y="8" width="84" height="204" rx="10" fill="url(#g-${f.id})"/>
    <rect x="22" y="4" width="76" height="8" rx="3" fill="#6b6665"/><rect x="22" y="208" width="76" height="8" rx="3" fill="#6b6665"/>
    <use href="#bear" x="40" y="22" width="40" height="40" style="color:#f0e6d6;--cut:#0c0a0a"/>
    <text x="60" y="84" text-anchor="middle" font-family="Archivo,sans-serif" font-stretch="125%" font-weight="700" font-size="12.5" fill="#f0e6d6" letter-spacing="1">BEARWICK</text>
    <text x="60" y="102" text-anchor="middle" font-family="Archivo,sans-serif" font-stretch="125%" font-weight="600" font-size="8" fill="${f.color}" letter-spacing="1">${f.name.toUpperCase()}</text>
    <text x="60" y="114" text-anchor="middle" font-family="Figtree,sans-serif" font-size="6" fill="#f0e6d6" letter-spacing="2">STOUT</text>
    <path fill="${f.color}" d="M18 202V160h8v-5h5v5h5v-14h5v-4h6v4h5v14h5v-5h5v5h6v-9h6v9h28v42z"/>
    <text x="60" y="193" text-anchor="middle" font-family="Figtree,sans-serif" font-size="4.5" fill="#0c0a0a" font-weight="700" letter-spacing="1">${ABV} ABV · 330ML</text>
  </svg>`;
}

/* ================= AGE GATE ================= */
function initAgeGate() {
  const gate = $('#age-gate');
  let ok = false;
  try { ok = localStorage.getItem('bw_age_ok') === '1'; } catch (e) {}   // storage can be blocked
  if (ok) return;
  gate.classList.remove('hidden'); gate.classList.add('flex'); document.body.style.overflow = 'hidden';
  $('#age-yes').addEventListener('click', () => {
    try { localStorage.setItem('bw_age_ok', '1'); } catch (e) {}
    gate.classList.add('hidden'); gate.classList.remove('flex'); document.body.style.overflow = '';
  });
  $('#age-no').addEventListener('click', () => $('#age-denied').classList.remove('hidden'));
}

/* ================= FLAVOUR SELECTOR (drives taste profile + accent colour) ================= */
function setFlavour(id) {
  state.flavour = id;
  document.documentElement.style.setProperty('--accent', fl(id).color);
  renderFlavours(); renderTaste();
}
function renderFlavours() {
  $('#flavour-cans').innerHTML = FLAVOURS.map((f) => `
    <button class="can-btn text-center" data-flavour="${f.id}" aria-pressed="${f.id === state.flavour}">
      <div class="w-28 sm:w-36 mx-auto drop-shadow-[0_20px_25px_rgba(0,0,0,.6)]">${canSVG(f)}</div>
      <p class="font-display wide mt-4" style="color:${f.color}">${f.name}</p></button>`).join('');
  const f = fl(state.flavour);
  $('#flavour-detail').innerHTML = `<p class="font-display wide text-xl" style="color:${f.color}">${f.tag}</p><p class="mt-3 text-cream/70">${f.desc}</p>`;
}

/* ================= TASTE PROFILES ================= */
function renderTaste() {
  $('#taste-tabs').innerHTML = FLAVOURS.map((f) =>
    `<button class="pill" role="tab" data-flavour="${f.id}" aria-selected="${f.id === state.flavour}">${f.name}</button>`).join('');
  const f = fl(state.flavour), attrs = Object.keys(f.profile);
  if (state.compare) {                       // one row per attribute, one bar per flavour
    $('#taste-panel').innerHTML = attrs.map((a) => `<div class="mb-5"><p class="text-sm mb-2">${a}</p>${FLAVOURS.map((x) =>
      `<div class="bar mb-1"><i style="width:${x.profile[a] * 20}%;background:${x.color}"></i></div>`).join('')}</div>`).join('')
      + `<p class="text-xs text-cream/50">${FLAVOURS.map((x) => `<span style="color:${x.color}">&#9632;</span> ${x.name}`).join('&nbsp;&nbsp;')}</p>`;
    return;
  }
  $('#taste-panel').innerHTML = `<div class="grid md:grid-cols-2 gap-8">
    <ul class="space-y-2 text-cream/80">${f.notes.map((n) => `<li>${n}</li>`).join('')}</ul>
    <div>${attrs.map((a) => `<div class="mb-4"><div class="flex justify-between text-sm mb-1"><span>${a}</span><span>${f.profile[a]}/5</span></div>
      <div class="bar"><i style="width:${f.profile[a] * 20}%;background:${f.color}"></i></div></div>`).join('')}</div></div>`;
}

/* ================= STATIC LISTS ================= */
function renderLists() {
  $('#hero-can').innerHTML = canSVG(FLAVOURS[0]);
  $('#ingredients').innerHTML = INGREDIENTS.map((i) => `<li class="border border-white/15 rounded-full px-4 py-2 text-sm">${i}</li>`).join('');
  $('#reviews').innerHTML = REVIEWS.map(([q, who]) => `<blockquote class="bg-ink rounded-3xl p-7"><p class="text-lg leading-snug">${q}</p><footer class="mt-4 text-xs text-cream/50">${who}</footer></blockquote>`).join('');
}

/* ================= SHOP ================= */
function renderShop() {
  $('#bundles').innerHTML = BUNDLES.map((b) => `
    <article class="${b.main ? 'md:col-span-2 bg-burg' : 'bg-esp'} rounded-3xl p-8 flex flex-col justify-between gap-6">
      <div><h3 class="font-display wide text-3xl">${b.name}</h3><p class="mt-3 text-cream/75 max-w-sm">${b.desc}</p></div>
      <div class="flex items-center justify-between gap-4"><span class="font-display wide text-3xl">${money(b.price)}</span>
      <button class="btn" data-add="${b.id}">Add to basket</button></div></article>`).join('');
  $('#product-grid').innerHTML = FLAVOURS.map((f) => `
    <article class="bg-char rounded-3xl p-6 flex flex-col border border-white/5">
      <div class="w-24 mx-auto">${canSVG(f)}</div>
      <h3 class="font-display wide text-lg mt-4" style="color:${f.color}">${f.name}</h3>
      <p class="text-sm text-cream/65 mt-2 flex-1">${f.desc}</p>
      <p class="text-xs text-cream/45 mt-3">${ABV} ABV · 330ml can${f.allergen ? ' · ' + f.allergen : ''}</p>
      <select class="mt-4 bg-ink border border-white/15 rounded-full px-4 py-2 text-sm" data-pack="${f.id}" aria-label="Pack size for ${f.name}">
        ${Object.entries(PACKS).map(([k, p]) => `<option value="${k}">${p.label} · ${money(p.price)}</option>`).join('')}</select>
      <button class="btn mt-3 !py-3" data-add-flavour="${f.id}">Add to basket</button></article>`).join('');
}

/* ================= BASKET ================= */
const Cart = {
  items: {},   // { key: { name, price, qty } }
  load() { try { this.items = JSON.parse(localStorage.getItem('bw_cart')) || {}; } catch (e) { this.items = {}; } },
  add(key, name, price) { (this.items[key] ||= { name, price, qty: 0 }).qty++; this.update(); this.open(); },
  change(key, d) { this.items[key].qty += d; if (this.items[key].qty <= 0) delete this.items[key]; this.update(); },
  open()  { $('#cart-drawer').classList.remove('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden','false'); $('#cart-overlay').classList.remove('opacity-0','pointer-events-none'); },
  close() { $('#cart-drawer').classList.add('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden','true'); $('#cart-overlay').classList.add('opacity-0','pointer-events-none'); },
  update() {
    try { localStorage.setItem('bw_cart', JSON.stringify(this.items)); } catch (e) {}
    const rows = Object.entries(this.items);
    const count = rows.reduce((s, [, i]) => s + i.qty, 0), total = rows.reduce((s, [, i]) => s + i.qty * i.price, 0);
    $('#cart-count').textContent = count; $('#cart-total').textContent = money(total); $('#checkout-btn').disabled = !count;
    $('#cart-items').innerHTML = count ? rows.map(([k, i]) => `<li class="flex items-center gap-4 bg-ink rounded-2xl p-4">
      <div class="flex-1"><p class="font-display wide text-sm">${i.name}</p><p class="text-xs text-cream/55">${money(i.price)} each</p>
        <div class="mt-2 flex items-center gap-3"><button class="w-7 h-7 rounded-full border border-white/20" data-qty="${k}" data-d="-1" aria-label="Fewer">&minus;</button>
        <span>${i.qty}</span><button class="w-7 h-7 rounded-full border border-white/20" data-qty="${k}" data-d="1" aria-label="More">+</button></div></div>
      <span class="font-bold">${money(i.price * i.qty)}</span></li>`).join('')
      : '<li class="text-center text-cream/55 mt-10">Your basket is empty. The Mixed 12-Pack is a good start.</li>';
  }
};

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate(); renderLists(); renderFlavours(); renderTaste(); renderShop(); Cart.load(); Cart.update();

  // One delegated click handler for all dynamic buttons
  document.addEventListener('click', (e) => {
    const t = (sel) => e.target.closest(sel);
    if (t('[data-flavour]')) setFlavour(t('[data-flavour]').dataset.flavour);
    if (t('[data-add]')) { const b = BUNDLES.find((x) => x.id === t('[data-add]').dataset.add); Cart.add(b.id, b.name, b.price); }
    if (t('[data-add-flavour]')) {
      const f = fl(t('[data-add-flavour]').dataset.addFlavour), k = document.querySelector(`[data-pack="${f.id}"]`).value, p = PACKS[k];
      Cart.add(`${f.id}:${k}`, `${f.name} ${p.label}`, p.price);
    }
    if (t('[data-qty]')) Cart.change(t('[data-qty]').dataset.qty, +t('[data-qty]').dataset.d);
  });
  $('#compare').addEventListener('change', (e) => { state.compare = e.target.checked; renderTaste(); });
  $('#cart-toggle').addEventListener('click', () => Cart.open());
  $('#cart-close').addEventListener('click', () => Cart.close());
  $('#cart-overlay').addEventListener('click', () => Cart.close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && Cart.close());
  $('#checkout-btn').addEventListener('click', () => alert('Demo only: connect Shopify, Stripe or your checkout of choice here.'));
  $('#menu-btn').addEventListener('click', () => { const m = $('#mobile-menu'); m.classList.toggle('hidden'); $('#menu-btn').setAttribute('aria-expanded', !m.classList.contains('hidden')); });
  $('#mobile-menu').addEventListener('click', () => $('#mobile-menu').classList.add('hidden'));
  $('#news-form').addEventListener('submit', (e) => { e.preventDefault(); $('#news-msg').textContent = 'Thanks, you are on the list (demo only, nothing was stored).'; e.target.reset(); });
});
