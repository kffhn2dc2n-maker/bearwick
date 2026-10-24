/* BEARWICK: page behaviour (vanilla JS)
   Order: DATA -> can artwork -> age gate -> flavour sections -> profiles -> shop -> basket -> init *

/* ================= DATA ================= */
// No ABV, tasting scores, nutrition or health claims: none are confirmed yet.
const FLAVOURS = [
  { id:'blackcurrant', name:'Blackcurrant Stout', lines:[['BLACKCURRANT','a'],['STOUT','c']], color:'#9b6be0', can:'#6d3fb8',
    tag:'Dark. Fruity. Balanced.',
    desc:'A smooth stout with a distinctive blackcurrant character. Fruity and easy to drink, with the roasted malt that keeps it properly stout.',
    fruit:['Blackcurrant','Gives the fruity, slightly tart character that sets this stout apart.'] },
  { id:'cherry', name:'Cherry & Vanilla Stout', lines:[['CHERRY &','a'],['VANILLA','c'],['STOUT','c']], color:'#d1405a', can:'#a3182f',
    tag:'Smooth. Rounded. Distinctive.',
    desc:'Cherry fruitiness softened by vanilla. Smooth and balanced, aiming to be rounded rather than sweet or dessert-like.',
    fruit:['Cherry and vanilla','Cherry brings the fruit; vanilla is there to round it off and keep it smooth.'] }
];
// Shared recipe: intended contribution only. Real flavour depends on brewing and tasting.
const BASE_INGREDIENTS = [
  ['Malt', 'Pale Malt', 'The base of the beer, intended to give body and a gentle malt backbone.'],
  ['Malt', 'Flaked Oats', 'Intended to add smoothness and a softer, rounder feel.'],
  ['Malt', 'Roasted Barley', 'Intended to bring the dark colour and the roasted character that makes it a stout.'],
  ['Hops', 'East Kent Goldings', 'A classic English hop, intended for gentle balance rather than sharp bitterness.'],
  ['Yeast', 'S-04 English Ale Yeast (dry)', 'A dry English ale yeast, intended for a clean, dependable ferment.']
];


/* ================= EDITABLE SETTINGS =================
   1) PRICES: change the price per can (GBP) here. These are provisional demonstration prices only.
   2) PROFILES: Top Trumps-style scores out of 10. Early brand-development estimates, not measured or tasted results.
      Add/remove rows in PROFILE_ATTRS to change which attributes appear. */
const PRICES = { blackcurrant: 3.50, cherry: 3.50 };
const MAX_QTY = 99;
const PROFILE_ATTRS = [['heaviness', 'Heaviness'], ['fruitiness', 'Fruitiness'], ['smoothness', 'Smoothness'], ['roasted', 'Roasted character'], ['sweetness', 'Sweetness']];
const PROFILES = {
  blackcurrant: { heaviness: 7, fruitiness: 6, smoothness: 7, roasted: 8, sweetness: 3 },
  cherry:       { heaviness: 6, fruitiness: 7, smoothness: 9, roasted: 6, sweetness: 5 }
};

/* ================= HELPERS ================= */
const $ = (s) => document.querySelector(s);
const money = (n) => '£' + n.toFixed(2);
const fl = (id) => FLAVOURS.find((f) => f.id === id);

/* ================= CAN ARTWORK =================
   The Modern Heritage can is drawn in cans.js (loaded first). */
function canSVG(f) { return BW.can('a', f, 'front'); }

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

/* ================= FLAVOUR SECTIONS ================= */
function renderFlavours() {
  $('#hero-cans').innerHTML = FLAVOURS.map((f, i) =>
    `<a href="#${f.id}" class="w-32 sm:w-44 lg:w-52 drop-shadow-[0_30px_40px_rgba(0,0,0,.65)] transition-transform duration-500 hover:-translate-y-3 ${i ? 'rotate-3 mb-0' : '-rotate-3 mb-6'}">${canSVG(f)}</a>`).join('');
  $('#flavour-sections').innerHTML = FLAVOURS.map((f, i) => {
    const items = [...BASE_INGREDIENTS, ['Fruit flavour', f.fruit[0], f.fruit[1]]];
    return `<article id="${f.id}" class="py-24" style="background:linear-gradient(180deg,${f.can}22,transparent 70%)">
      <div class="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center">
        <div class="flex justify-center ${i % 2 ? 'lg:order-2' : ''}"><div class="w-48 sm:w-60 drop-shadow-[0_30px_40px_rgba(0,0,0,.65)]">${canSVG(f)}</div></div>
        <div>
          <p class="font-display wide text-sm tracking-widest" style="color:${f.color}">${f.tag}</p>
          <h2 class="font-display wide font-extrabold text-4xl md:text-5xl mt-2">${f.name}</h2>
          <p class="mt-5 text-lg text-cream/75 leading-relaxed max-w-lg">${f.desc}</p>
          <h3 class="font-display wide text-sm mt-10 mb-3 text-cream/60">Ingredients</h3>
          <dl class="grid sm:grid-cols-2 gap-3">${items.map(([g, n, d]) => `<div class="rounded-2xl bg-ink/60 border border-white/10 p-4">
            <dt class="text-[11px] tracking-widest uppercase" style="color:${f.color}">${g}</dt><dd class="font-bold mt-1">${n}</dd><dd class="text-sm text-cream/60 mt-1">${d}</dd></div>`).join('')}</dl>
          <p class="mt-4 text-xs text-cream/45">This is the intended recipe. The finished flavour will be confirmed through brewing and tasting.</p>
        </div>
      </div></article>`;
  }).join('');
}

/* ================= FLAVOUR PROFILES (Top Trumps style) ================= */
function renderProfiles() {
  $('#profile-grid').innerHTML = FLAVOURS.map((f, i) => `
    <article class="rounded-3xl border border-white/15 bg-gradient-to-b from-char to-ink p-5" style="box-shadow:0 0 0 3px ${f.can}66">
      <div class="flex items-center justify-between"><h3 class="font-display wide text-lg">${f.name}</h3><span class="font-display text-3xl font-extrabold" style="color:${f.color}" aria-hidden="true">0${i + 1}</span></div>
      <div class="mt-4 rounded-2xl bg-ink flex justify-center py-5"><div class="w-24">${canSVG(f)}</div></div>
      <dl class="mt-5 space-y-3">${PROFILE_ATTRS.map(([k, label]) => { const v = PROFILES[f.id][k];
        return `<div><div class="flex justify-between text-xs tracking-widest uppercase"><dt>${label}</dt><dd class="font-bold" style="color:${f.color}">${v}/10</dd></div>
        <div class="bar mt-1.5" role="img" aria-label="${label}: ${v} out of 10"><i style="width:${v * 10}%;background:${f.color}"></i></div></div>`; }).join('')}</dl>
      <p class="mt-5 text-[11px] text-cream/45">Preliminary brand-development estimate. Not a measured or tasted result.</p>
    </article>`).join('');
}

/* ================= SHOP (concept preview) ================= */
function renderShop() {
  $('#product-grid').innerHTML = FLAVOURS.map((f) => `
    <article class="bg-char rounded-3xl p-6 flex gap-5 border border-white/5">
      <div class="w-24 shrink-0">${canSVG(f)}</div>
      <div class="flex flex-col flex-1">
        <h3 class="font-display wide text-lg" style="color:${f.color}">${f.name}</h3>
        <p class="text-sm text-cream/65 mt-2">${f.tag}</p>
        <p class="mt-3 font-display text-2xl font-bold">${money(PRICES[f.id])} <span class="text-xs font-normal text-cream/50">per can · provisional</span></p>
        <div class="mt-4 flex items-center gap-2" role="group" aria-label="Quantity of ${f.name}">
          <button type="button" class="w-9 h-9 rounded-full border border-white/25" data-step="${f.id}" data-d="-1" aria-label="Fewer ${f.name}">&minus;</button>
          <input id="qty-${f.id}" type="number" inputmode="numeric" min="1" max="${MAX_QTY}" value="1" class="w-14 text-center bg-ink border border-white/15 rounded-full py-2" aria-label="Quantity">
          <button type="button" class="w-9 h-9 rounded-full border border-white/25" data-step="${f.id}" data-d="1" aria-label="More ${f.name}">+</button>
        </div>
        <button type="button" class="btn mt-4 !py-3" data-add="${f.id}">Add to basket</button>
      </div></article>`).join('');
}
const readQty = (id) => { const q = parseInt($('#qty-' + id).value, 10); return Number.isFinite(q) ? Math.min(Math.max(q, 1), MAX_QTY) : 1; };   // zero, negative or blank becomes 1

/* ================= BASKET ================= */
const Cart = {
  items: {},   // { flavourId: quantity }  (names and prices are always read from FLAVOURS/PRICES)
  load() { try { const s = JSON.parse(localStorage.getItem('bw_cart2')) || {}; this.items = {}; for (const id in s) if (PRICES[id] && s[id] > 0) this.items[id] = Math.min(Math.floor(s[id]), MAX_QTY); } catch (e) { this.items = {}; } },
  save() { try { localStorage.setItem('bw_cart2', JSON.stringify(this.items)); } catch (e) {} },
  add(id, q) { this.items[id] = Math.min((this.items[id] || 0) + q, MAX_QTY); this.update(); this.open(); },
  change(id, d) { this.items[id] = (this.items[id] || 0) + d; if (this.items[id] <= 0) delete this.items[id]; this.update(); },
  remove(id) { delete this.items[id]; this.update(); },
  open() { $('#cart-drawer').classList.remove('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden', 'false'); $('#cart-overlay').classList.remove('opacity-0', 'pointer-events-none'); $('#cart-close').focus(); },
  close() { $('#cart-drawer').classList.add('translate-x-full'); $('#cart-drawer').setAttribute('aria-hidden', 'true'); $('#cart-overlay').classList.add('opacity-0', 'pointer-events-none'); $('#checkout-msg').classList.add('hidden'); },
  update() {
    this.save();
    const rows = Object.entries(this.items);
    const count = rows.reduce((s, [, q]) => s + q, 0), total = rows.reduce((s, [id, q]) => s + q * PRICES[id], 0);
    $('#cart-count').textContent = count; $('#cart-total').textContent = money(total); $('#checkout-btn').disabled = !count;
    $('#cart-items').innerHTML = count ? rows.map(([id, q]) => `<li class="flex items-start gap-4 bg-ink rounded-2xl p-4">
      <div class="flex-1"><p class="font-display wide text-sm">${fl(id).name}</p><p class="text-xs text-cream/55">${money(PRICES[id])} each</p>
        <div class="mt-2 flex items-center gap-3"><button type="button" class="w-8 h-8 rounded-full border border-white/20" data-change="${id}" data-d="-1" aria-label="Fewer ${fl(id).name}">&minus;</button>
        <span aria-label="Quantity">${q}</span><button type="button" class="w-8 h-8 rounded-full border border-white/20" data-change="${id}" data-d="1" aria-label="More ${fl(id).name}">+</button>
        <button type="button" class="ml-2 text-xs underline text-cream/60" data-remove="${id}">Remove</button></div></div>
      <span class="font-bold">${money(q * PRICES[id])}</span></li>`).join('')
      : '<li class="text-center text-cream/55 mt-10">Your basket is empty. Add a can to preview the basket.</li>';
  }
};

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate(); renderFlavours(); renderProfiles(); renderShop(); Cart.load(); Cart.update();
  document.addEventListener('click', (e) => {
    const t = (sel) => e.target.closest(sel);   // one delegated handler for dynamic buttons
    let b;
    if ((b = t('[data-add]'))) { const id = b.dataset.add; Cart.add(id, readQty(id)); $('#qty-' + id).value = 1; }
    if ((b = t('[data-step]'))) { const i = $('#qty-' + b.dataset.step); i.value = Math.min(Math.max(readQty(b.dataset.step) + +b.dataset.d, 1), MAX_QTY); }
    if ((b = t('[data-change]'))) Cart.change(b.dataset.change, +b.dataset.d);
    if ((b = t('[data-remove]'))) Cart.remove(b.dataset.remove);
  });
  $('#cart-toggle').addEventListener('click', () => Cart.open());
  $('#cart-close').addEventListener('click', () => Cart.close());
  $('#cart-overlay').addEventListener('click', () => Cart.close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && Cart.close());
  $('#checkout-btn').addEventListener('click', () => $('#checkout-msg').classList.remove('hidden'));
  $('#menu-btn').addEventListener('click', () => { const m = $('#mobile-menu'); m.classList.toggle('hidden'); $('#menu-btn').setAttribute('aria-expanded', !m.classList.contains('hidden')); });
  $('#mobile-menu').addEventListener('click', () => $('#mobile-menu').classList.add('hidden'));
  $('#news-form').addEventListener('submit', (e) => { e.preventDefault(); $('#news-msg').textContent = 'Thanks, you are on the list (demo only, nothing was stored).'; e.target.reset(); });
});
