/* BEARWICK: three can concepts x two flavours, with front + side-angle mockups.
   Concept artwork only: no ABV, nutrition, prices or availability claims. */
(function () {
  const CR = '#efe3cf', BR = '#b8975a', INK = '#0e0e0e', IMG = 'assets/bear-colour-transparent.png', AR = .96, FF = 'Verdana,Geneva,sans-serif';
  let uid = 0;
  const T = (x, y, s, sz, fill, ls = 0) => ['#000', fill].map((c, i) =>
    `<text x="${x}" y="${y + (i ? 0 : .5)}" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="${sz}" letter-spacing="${ls}" fill="${c}"${i ? '' : ' opacity=".55"'}>${s}</text>`).join('');
  const lines = (f, y0, gap, sc, acc, base) => f.lines.map(([t, k], i) =>
    T(60, y0 + i * gap, t, t === 'STOUT' ? 5.4 * sc : (t.length > 10 ? 6.6 : 8.2) * sc, k === 'a' ? acc : base, t === 'STOUT' ? 3 : .5)).join('');
  const bear = (u, cx, cy, r, ring, sw, h) => `<circle cx="${cx}" cy="${cy}" r="${r + 1.1}" fill="none" stroke="${ring}" stroke-width="${sw}"/>
    <image href="${IMG}" x="${cx - h * AR / 2}" y="${cy - h / 2}" width="${h * AR}" height="${h}" filter="url(#hl${u})"/>`;
  const bub = (n, col) => Array.from({ length: n }, (_, i) => `<circle cx="${22 + (i * 53) % 76}" cy="${30 + (i * 71) % 190}" r="${1 + (i % 3) * .7}" fill="${col}" opacity=".2"/>`).join('');
  const foot = `<text x="60" y="224" text-anchor="middle" font-family="${FF}" font-size="3.2" fill="${CR}" opacity=".5" letter-spacing="1.5">CONCEPT DESIGN</text>`;

  /* A: Modern heritage. Brass frame, embossed type, bear emblem */
  const A = (f, u) => `<rect x="24" y="30" width="72" height="186" rx="5" fill="none" stroke="${BR}" stroke-width=".7"/>
    <rect x="26.2" y="32.2" width="67.6" height="181.6" rx="3.5" fill="none" stroke="${BR}" stroke-width=".25" opacity=".7"/>
    <text x="60" y="44" text-anchor="middle" font-family="${FF}" font-size="3.2" fill="${BR}" letter-spacing="1.8">WARWICKSHIRE</text>
    ${bear(u, 60, 78, 22, BR, .8, 36)}${T(60, 125, 'BEARWICK', 10.5, CR, 1.2)}
    <path d="M42 132H78" stroke="${BR}" stroke-width=".6"/><path d="M60 129.8l2.2 2.2-2.2 2.2-2.2-2.2z" fill="${BR}"/>
    ${lines(f, 148, 11.5, 1, f.color, CR)}<rect x="24" y="192" width="72" height="4" fill="${f.can}"/>${foot}`;

  /* B: Bold contemporary craft. Giant name, fruit circles, sticker bear */
  const B = (f, u) => `<circle cx="104" cy="46" r="38" fill="${f.can}"/><circle cx="8" cy="160" r="32" fill="${f.can}" opacity=".85"/>
    <circle cx="60" cy="130" r="40" fill="none" stroke="${f.color}" stroke-width=".8" opacity=".6"/>${bub(16, CR)}
    ${T(60, 60, 'BEAR', 21, CR, 1)}${T(60, 83, 'WICK', 21, f.color, 1)}
    <circle cx="60" cy="128" r="33" fill="${f.color}"/><image href="${IMG}" x="${60 - 31 * AR}" y="97" width="${62 * AR}" height="62" filter="url(#hl${u})"/>
    <rect x="22" y="166" width="76" height="${6 + f.lines.length * 9}" rx="8" fill="${CR}"/>${f.lines.map(([t, k], i) => `<text x="60" y="${176.5 + i * 9}" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="${t === 'STOUT' ? 4.8 : t.length > 10 ? 5.6 : 6.8}" letter-spacing="${t === 'STOUT' ? 3 : .4}" fill="${k === 'a' ? f.can : '#17121c'}">${t}</text>`).join('')}
    <rect x="-100" y="206" width="320" height="7" fill="${f.color}"/>${foot}`;

  /* C: Dark indulgence. Stout-head wave, fruit swirls, foil type, gloss */
  const C = (f, u) => `<defs><radialGradient id="g${u}" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="${f.color}" stop-opacity=".5"/><stop offset="1" stop-color="${f.color}" stop-opacity="0"/></radialGradient>
    <linearGradient id="b${u}" x1="0" x2="1"><stop offset="0" stop-color="#8a6d3b"/><stop offset=".5" stop-color="#e3c98a"/><stop offset="1" stop-color="#8a6d3b"/></linearGradient>
    <linearGradient id="h${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#d8c7a6"/></linearGradient></defs>
    <rect x="-100" y="40" width="320" height="190" fill="url(#g${u})"/>
    ${[0, 1, 2, 3, 4].map((i) => `<path d="M16 ${150 + i * 7}C42 ${112 + i * 6} 76 ${196 - i * 4} 104 ${146 + i * 9}" fill="none" stroke="${i % 2 ? 'url(#b' + u + ')' : f.color}" stroke-width="${i % 2 ? .35 : .9}" opacity="${i % 2 ? .8 : .6}"/>`).join('')}
    <path d="${WAVE}" fill="url(#h${u})"/>${bub(10, CR)}
    ${T(60, 66, 'BEARWICK', 10.5, 'url(#b' + u + ')', 1.2)}${lines(f, 98, 13, 1.12, f.color, CR)}
    ${bear(u, 60, 192, 13, BR, .7, 22)}${foot}
    <path d="M30 20L58 20L24 225L18 225Z" fill="#fff" opacity=".05"/>`;

  const WAVE = 'M-120 14H240V40Q232 46 224 40' + Array.from({ length: 22 }, (_, i) => 'T' + (208 - i * 16) + ' 40').join('') + 'Z';
  const ART = { a: A, b: B, c: C };
  const INFO = [
    ['a', 'Concept A: Modern heritage', 'Premium, confident and timeless. A brass-framed bear emblem, embossed type and a quiet nod to Warwickshire.'],
    ['b', 'Concept B: Bold contemporary craft', 'Big, loud and readable from across a room. Oversized name, fruit-circle graphics and the bear as a sticker-style hero.'],
    ['c', 'Concept C: Dark indulgence', 'Moody and tactile. A creamy stout-head wave, flowing fruit swirls, foil type and gloss for social photos.']
  ];

  function can(concept, f, view) {
    const u = ++uid, side = view === 'side';
    const body = 'M18 24Q18 15 28 13H92Q102 15 102 24V222Q102 231 92 233H28Q18 231 18 222Z';
    return `<svg viewBox="0 0 120 246" class="w-full h-auto" role="img" aria-label="BEARWICK ${f.name} concept can, ${side ? 'side angle' : 'front'}">
      <defs><filter id="hl${u}" x="-8%" y="-8%" width="116%" height="116%"><feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="d"/><feFlood flood-color="${CR}"/><feComposite in2="d" operator="in" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter><clipPath id="k${u}"><path d="${body}"/></clipPath>
      <linearGradient id="y${u}" x1="0" x2="1"><stop offset="0" stop-color="#050505"/><stop offset=".25" stop-color="#1c1c1c"/><stop offset=".5" stop-color="#111"/><stop offset=".85" stop-color="#171717"/><stop offset="1" stop-color="#050505"/></linearGradient>
      <linearGradient id="r${u}" x1="0" x2="1"><stop offset="0" stop-color="#5d5d5d"/><stop offset=".4" stop-color="#c4c4c4"/><stop offset="1" stop-color="#555"/></linearGradient>
      <linearGradient id="s${u}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></linearGradient></defs>
      <path d="${body}" fill="url(#y${u})"/>
      <g clip-path="url(#k${u})"><g transform="${side ? 'translate(76 0) scale(.5 1) translate(-60 0)' : ''}">${ART[concept](f, u)}</g>
        <rect x="${side ? 74 : 26}" y="26" width="4" height="196" rx="2" fill="#fff" opacity="${concept === 'c' ? .16 : .08}"/>
        <rect x="18" y="13" width="84" height="220" fill="url(#s${u})"/></g>
      <rect x="24" y="8" width="72" height="9" rx="3.5" fill="url(#r${u})"/><rect x="24" y="230" width="72" height="9" rx="3.5" fill="url(#r${u})"/></svg>`;
  }

  const BW = window.BW = { active: 'b', can };

  function render() {
    const host = document.getElementById('concepts'); if (!host) return;
    host.innerHTML = `<div class="max-w-6xl mx-auto px-5 py-24">
      <h2 class="font-display wide font-extrabold text-3xl md:text-5xl">Can concepts.</h2>
      <p class="mt-4 text-cream/65 max-w-2xl">Three genuinely different directions, each shown in both flavours at the same angles, lighting and background so they can be compared fairly. Mockups are artwork only; recipes and printed finishes are still in development.</p>
      ${INFO.map(([id, title, blurb]) => `<article class="mt-16"><div class="flex flex-wrap items-end justify-between gap-4">
        <div class="max-w-xl"><h3 class="font-display wide text-xl">${title}</h3><p class="mt-2 text-sm text-cream/65">${blurb}</p></div>
        <button class="${BW.active === id ? 'btn' : 'btn-ghost'} !py-2.5 !px-5" data-concept="${id}">${BW.active === id ? 'In use on site' : 'Use on the site'}</button></div>
        <div class="mt-6 grid md:grid-cols-2 gap-5">${FLAVOURS.map((f) => `<div class="stage rounded-3xl px-4 pt-8 pb-5"><div class="flex items-end justify-center gap-3 sm:gap-6">
          <div class="w-24 sm:w-32 can-shadow">${can(id, f, 'front')}</div><div class="w-20 sm:w-28 can-shadow">${can(id, f, 'side')}</div></div>
          <p class="mt-4 text-center text-xs tracking-widest uppercase" style="color:${f.color}">${f.name}</p></div>`).join('')}</div></article>`).join('')}
      <div class="mt-16 rounded-3xl bg-burg/40 border border-white/10 p-8"><h3 class="font-display wide text-xl">Our recommendation: Concept B, with brass touches from A</h3>
        <p class="mt-3 text-cream/75 leading-relaxed max-w-3xl">B has the most shelf impact: the oversized name reads quickly among competing cans, the bear is the most memorable element, and the colour circles let each future flavour change colour without changing the structure. A is the most premium and credible stout, so borrowing its fine brass details would add polish to B. C photographs well but is the busiest at distance and would be the most demanding to print. All three need real print proofs and shelf tests before anything is final.</p></div></div>`;
  }
  BW.render = render;
  document.addEventListener('DOMContentLoaded', render);
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-concept]'); if (!b) return;
    BW.active = b.dataset.concept; renderFlavours(); renderShop(); render();
  });
})();
