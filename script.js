/* BEARWICK: page behaviour (vanilla JS)
   Order: DATA -> can artwork -> age gate -> flavour sections -> shop -> basket -> init */

/* ================= DATA ================= */
// No ABV, tasting scores, nutrition or health claims: none are confirmed yet.
const FLAVOURS = [
  { id:'blackcurrant', name:'Blackcurrant Stout', lines:['BLACKCURRANT'], color:'#9b6be0', can:'#6d3fb8',
    tag:'Dark. Fruity. Balanced.',
    desc:'A smooth stout with a distinctive blackcurrant character. Fruity and easy to drink, with the roasted malt that keeps it properly stout.',
    fruit:['Blackcurrant','Gives the fruity, slightly tart character that sets this stout apart.'] },
  { id:'cherry', name:'Cherry & Vanilla Stout', lines:['CHERRY','& VANILLA'], color:'#d1405a', can:'#a3182f',
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
const PACKS = { single:{label:'Single can', price:2.75}, four:{label:'4-pack', price:9.75}, twelve:{label:'12-pack', price:26} };
const BUNDLE = { id:'mixed12', name:'Mixed 12-Pack', price:27, desc:'Six of each flavour. The easiest way to meet both.' };

/* ================= HELPERS ================= */
const $ = (s) => document.querySelector(s);
const money = (n) => '£' + n.toFixed(2);
const fl = (id) => FLAVOURS.find((f) => f.id === id);

/* ================= CAN ARTWORK =================
   Realistic aluminium can: black body, metal rims, highlight, bear mascot, wordmark,
   restrained flavour accent, and a Warwick castle skyline band. */
function canSVG(f) {
  const name = f.lines.map((l, i) => `<text x="60" y="${150 + i * 10}" text-anchor="middle" font-family="Archivo,sans-serif" font-stretch="125%" font-weight="700" font-size="7.5" fill="${f.color}" letter-spacing="1">${l}</text>`).join('');
  return `<svg viewBox="0 0 120 246" class="w-full h-auto" role="img" aria-label="BEARWICK ${f.name} can">
    <defs>
      <linearGradient id="body-${f.id}" x1="0" x2="1"><stop offset="0" stop-color="#030303"/><stop offset=".2" stop-color="#2e2e2e"/><stop offset=".34" stop-color="#0e0e0e"/><stop offset=".78" stop-color="#0a0a0a"/><stop offset=".93" stop-color="#262626"/><stop offset="1" stop-color="#030303"/></linearGradient>
      <linearGradient id="metal" x1="0" x2="1"><stop offset="0" stop-color="#6b6b6b"/><stop offset=".35" stop-color="#e4e4e4"/><stop offset=".65" stop-color="#9a9a9a"/><stop offset="1" stop-color="#5a5a5a"/></linearGradient>
    </defs>
    <path d="M18 24Q18 15 28 13H92Q102 15 102 24V222Q102 231 92 233H28Q18 231 18 222Z" fill="url(#body-${f.id})"/>
    <rect x="24" y="8" width="72" height="9" rx="3.5" fill="url(#metal)"/><rect x="24" y="230" width="72" height="9" rx="3.5" fill="url(#metal)"/>
    <rect x="25" y="26" width="5" height="194" rx="2.5" fill="#fff" opacity=".12"/>
    <use href="#bear" x="34" y="30" width="52" height="68" style="color:#f0e6d6;--cut:#0b0b0b"/>
    <text x="60" y="120" text-anchor="middle" font-family="Archivo,sans-serif" font-stretch="125%" font-weight="800" font-size="13" fill="#f0e6d6" letter-spacing="1.2">BEARWICK</text>
    <text x="60" y="132" text-anchor="middle" font-family="Figtree,sans-serif" font-size="6" fill="#f0e6d6" letter-spacing="3.5">STOUT</text>
    <rect x="44" y="137" width="32" height="1.4" fill="${f.can}"/>
    ${name}
    <g transform="translate(0,28)"><path fill="${f.can}" d="M18 202V160h8v-5h5v5h5v-14h5v-4h6v4h5v14h5v-5h5v5h6v-9h6v9h28v42z"/></g>
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

/* ================= SHOP ================= */
function renderShop() {
  $('#bundles').innerHTML = `<article class="bg-burg rounded-3xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div class="flex items-center gap-5"><div class="flex gap-1 w-24">${FLAVOURS.map((f) => `<div class="w-1/2">${canSVG(f)}</div>`).join('')}</div>
    <div><h3 class="font-display wide text-3xl">${BUNDLE.name}</h3><p class="mt-2 text-cream/75 max-w-sm">${BUNDLE.desc}</p></div></div>
    <div class="flex items-center gap-5"><span class="font-display wide text-3xl">${money(BUNDLE.price)}</span><button class="btn" data-add-bundle>Add to basket</button></div></article>`;
  $('#product-grid').innerHTML = FLAVOURS.map((f) => `
    <article class="bg-char rounded-3xl p-6 flex gap-5 border border-white/5">
      <div class="w-20 shrink-0">${canSVG(f)}</div>
      <div class="flex flex-col flex-1">
        <h3 class="font-display wide text-lg" style="color:${f.color}">${f.name}</h3>
        <p class="text-sm text-cream/65 mt-2 flex-1">${f.tag}</p>
        <select class="mt-4 bg-ink border border-white/15 rounded-full px-4 py-2 text-sm" data-pack="${f.id}" aria-label="Pack size for ${f.name}">
          ${Object.entries(PACKS).map(([k, p]) => `<option value="${k}">${p.label} · ${money(p.price)}</option>`).join('')}</select>
        <button class="btn mt-3 !py-3" data-add-flavour="${f.id}">Add to basket</button>
      </div></article>`).join('');
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
  initAgeGate(); renderFlavours(); renderShop(); Cart.load(); Cart.update();
  document.addEventListener('click', (e) => {
    const t = (sel) => e.target.closest(sel);   // one delegated handler for dynamic buttons
    if (t('[data-add-bundle]')) Cart.add(BUNDLE.id, BUNDLE.name, BUNDLE.price);
    if (t('[data-add-flavour]')) {
      const f = fl(t('[data-add-flavour]').dataset.addFlavour), k = document.querySelector(`[data-pack="${f.id}"]`).value, p = PACKS[k];
      Cart.add(`${f.id}:${k}`, `${f.name}, ${p.label}`, p.price);
    }
    if (t('[data-qty]')) Cart.change(t('[data-qty]').dataset.qty, +t('[data-qty]').dataset.d);
  });
  $('#cart-toggle').addEventListener('click', () => Cart.open());
  $('#cart-close').addEventListener('click', () => Cart.close());
  $('#cart-overlay').addEventListener('click', () => Cart.close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && Cart.close());
  $('#checkout-btn').addEventListener('click', () => alert('Demo only: connect Shopify, Stripe or your checkout of choice here.'));
  $('#menu-btn').addEventListener('click', () => { const m = $('#mobile-menu'); m.classList.toggle('hidden'); $('#menu-btn').setAttribute('aria-expanded', !m.classList.contains('hidden')); });
  $('#mobile-menu').addEventListener('click', () => $('#mobile-menu').classList.add('hidden'));
  $('#news-form').addEventListener('submit', (e) => { e.preventDefault(); $('#news-msg').textContent = 'Thanks, you are on the list (demo only, nothing was stored).'; e.target.reset(); });
});
