/* BEARWICK: page behaviour (vanilla JS)
   Order: DATA -> can artwork -> age gate -> flavour sections -> init *

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

/* ================= HELPERS ================= */
const $ = (s) => document.querySelector(s);

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

/* ================= INIT ================= */
document.addEventListener('DOMContentLoaded', () => {
  initAgeGate(); renderFlavours();
  $('#menu-btn').addEventListener('click', () => { const m = $('#mobile-menu'); m.classList.toggle('hidden'); $('#menu-btn').setAttribute('aria-expanded', !m.classList.contains('hidden')); });
  $('#mobile-menu').addEventListener('click', () => $('#mobile-menu').classList.add('hidden'));
  $('#news-form').addEventListener('submit', (e) => { e.preventDefault(); $('#news-msg').textContent = 'Thanks, you are on the list (demo only, nothing was stored).'; e.target.reset(); });
});
