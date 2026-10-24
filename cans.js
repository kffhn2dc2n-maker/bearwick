/* BEARWICK: the can design (Modern Heritage) in both flavours, with front + side-angle mockups.
   Artwork only: no ABV, nutrition, prices or availability claims. */
(function () {
  const CR = '#efe3cf', BR = '#b8975a', INK = '#0e0e0e', IMG = 'assets/bear-colour-transparent.png', AR = .96, FF = 'Verdana,Geneva,sans-serif';
  let uid = 0;
  const T = (x, y, s, sz, fill, ls = 0) => ['#000', fill].map((c, i) =>
    `<text x="${x}" y="${y + (i ? 0 : .5)}" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="${sz}" letter-spacing="${ls}" fill="${c}"${i ? '' : ' opacity=".55"'}>${s}</text>`).join('');
  const lines = (f, y0, gap, sc, acc, base) => f.lines.map(([t, k], i) =>
    T(60, y0 + i * gap, t, t === 'STOUT' ? 5.4 * sc : (t.length > 10 ? 6.6 : 8.2) * sc, k === 'a' ? acc : base, t === 'STOUT' ? 3 : .5)).join('');
  const bear = (u, cx, cy, r, ring, sw, h) => `<circle cx="${cx}" cy="${cy}" r="${r + 1.1}" fill="none" stroke="${ring}" stroke-width="${sw}"/>
    <image href="${IMG}" x="${cx - h * AR / 2}" y="${cy - h / 2}" width="${h * AR}" height="${h}" filter="url(#hl${u})"/>`;
  const foot = `<text x="60" y="224" text-anchor="middle" font-family="${FF}" font-size="3.2" fill="${CR}" opacity=".5" letter-spacing="1.5">ALL YEAR BEARWICK</text>`;

  /* A: Modern heritage. Brass frame, embossed type, bear emblem */
  const A = (f, u) => `<rect x="24" y="30" width="72" height="186" rx="5" fill="none" stroke="${BR}" stroke-width=".7"/>
    <rect x="26.2" y="32.2" width="67.6" height="181.6" rx="3.5" fill="none" stroke="${BR}" stroke-width=".25" opacity=".7"/>
    <text x="60" y="44" text-anchor="middle" font-family="${FF}" font-size="3.2" fill="${BR}" letter-spacing="1.8">WARWICKSHIRE</text>
    ${bear(u, 60, 78, 22, BR, .8, 36)}${T(60, 125, 'BEARWICK', 10.5, CR, 1.2)}
    <path d="M42 132H78" stroke="${BR}" stroke-width=".6"/><path d="M60 129.8l2.2 2.2-2.2 2.2-2.2-2.2z" fill="${BR}"/>
    ${lines(f, 148, 11.5, 1, f.color, CR)}<rect x="24" y="192" width="72" height="4" fill="${f.can}"/>${foot}`;

  const ART = { a: A };

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
        <rect x="${side ? 74 : 26}" y="26" width="4" height="196" rx="2" fill="#fff" opacity=".08"/>
        <rect x="18" y="13" width="84" height="220" fill="url(#s${u})"/></g>
      <rect x="24" y="8" width="72" height="9" rx="3.5" fill="url(#r${u})"/><rect x="24" y="230" width="72" height="9" rx="3.5" fill="url(#r${u})"/></svg>`;
  }

  const BW = window.BW = { active: 'a', can };

  function render() {
    const host = document.getElementById('cans'); if (!host) return;
    host.innerHTML = `<div class="max-w-6xl mx-auto px-5 py-24">
      <h2 class="font-display wide font-extrabold text-3xl md:text-5xl">Two flavours. One bear.</h2>
      <p class="mt-4 text-cream/65 max-w-xl">Near-black cans with a brass-framed bear and one deep fruit accent each. Dark, fruity and properly stout.</p>
      <div class="mt-12 grid md:grid-cols-2 gap-5">${FLAVOURS.map((f) => `<a href="#${f.id}" class="stage block rounded-3xl px-4 pt-10 pb-6"><div class="flex items-end justify-center gap-3 sm:gap-6">
        <div class="w-28 sm:w-40 can-shadow">${can('a', f, 'front')}</div><div class="w-24 sm:w-32 can-shadow">${can('a', f, 'side')}</div></div>
        <p class="mt-6 text-center text-sm tracking-widest uppercase" style="color:${f.color}">${f.name}</p><p class="mt-1 text-center text-xs text-cream/55">${f.tag}</p></a>`).join('')}</div></div>`;
  }
  BW.render = render;
  document.addEventListener('DOMContentLoaded', render);
})();
