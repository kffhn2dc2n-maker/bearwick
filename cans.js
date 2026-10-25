/* BEARWICK: the can design (Modern Heritage) in both flavours, with front + side-angle mockups.
   Artwork only: no ABV, nutrition, prices or availability claims. */
(function () {
  const CR = '#efe3cf', BR = '#b8975a', INK = '#0e0e0e', IMG = 'assets/bear-colour-transparent.png', AR = .96, FF = 'Verdana,Geneva,sans-serif';
  let uid = 0;
  const BW = window.BW = { can: null, abv: '4.2% ABV' };   // abv: intended strength, shown on every can and in the shop text
  const T = (x, y, s, sz, fill, ls = 0) => ['#000', fill].map((c, i) =>
    `<text x="${x}" y="${y + (i ? 0 : .5)}" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="${sz}" letter-spacing="${ls}" fill="${c}"${i ? '' : ' opacity=".55"'}>${s}</text>`).join('');
  const lines = (f, y0, gap, sc, acc, base) => f.lines.map(([t, k], i) =>
    T(60, y0 + i * gap, t, t === 'STOUT' ? 5.4 * sc : (t.length > 10 ? 6.6 : 8.2) * sc, k === 'a' ? acc : base, t === 'STOUT' ? 3 : .5)).join('');
  const bear = (u, cx, cy, r, ring, sw, h) => `<circle cx="${cx}" cy="${cy}" r="${r + 1.1}" fill="none" stroke="${ring}" stroke-width="${sw}"/>
    <image href="${IMG}" x="${cx - h * AR / 2}" y="${cy - h / 2}" width="${h * AR}" height="${h}" filter="url(#hl${u})"/>`;
  const foot = `<text x="60" y="224" text-anchor="middle" font-family="${FF}" font-size="3.2" fill="${CR}" opacity=".5" letter-spacing="1.5">ALL YEAR BEARWICK</text>`;

  /* A: Modern heritage, laid out for a short, wide 330ml can (artwork area ~72 x 118) */
  const A = (f, u) => `<rect x="24" y="34" width="72" height="116" rx="5" fill="none" stroke="${BR}" stroke-width=".7"/>
    <rect x="26.2" y="36.2" width="67.6" height="111.6" rx="3.5" fill="none" stroke="${BR}" stroke-width=".25" opacity=".7"/>
    <text x="60" y="44.5" text-anchor="middle" font-family="${FF}" font-size="3" fill="${BR}" letter-spacing="1.8">WARWICKSHIRE</text>
    ${bear(u, 60, 66, 14, BR, .8, 24)}${T(60, 97, 'BEARWICK', 9.5, CR, 1)}
    <path d="M44 102H76" stroke="${BR}" stroke-width=".6"/><path d="M60 100l2 2-2 2-2-2z" fill="${BR}"/>
    ${lines(f, 112, 9.5, .95, f.color, CR)}<rect x="24" y="135.5" width="72" height="3.2" fill="${f.can}"/>
    <text x="60" y="145.5" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="4.6" fill="${CR}" letter-spacing=".8">${BW.abv}</text>
    <text x="60" y="155" text-anchor="middle" font-family="${FF}" font-size="2.4" fill="${CR}" opacity=".45" letter-spacing="1.2">CONCEPT DESIGN</text>`;

  const ART = { a: A };

  function can(concept, f, view) {
    const u = ++uid, side = view === 'side';
    const body = 'M18 38Q18 30 26 26L32 22H88L94 26Q102 30 102 38V150Q102 160 92 162H28Q18 160 18 150Z';   // 84 wide x 140 tall, about 1.7:1 like a 330ml can
    return `<svg viewBox="0 0 120 172" class="w-full h-auto" role="img" aria-label="BEARWICK ${f.name} 330ml concept can, ${side ? 'side angle' : 'front, slight angle'}">
      <defs><filter id="hl${u}" x="-8%" y="-8%" width="116%" height="116%"><feMorphology in="SourceAlpha" operator="dilate" radius=".5" result="d"/><feFlood flood-color="${CR}"/><feComposite in2="d" operator="in" result="h"/><feMerge><feMergeNode in="h"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <clipPath id="k${u}"><path d="${body}"/></clipPath>
      <linearGradient id="y${u}" x1="0" x2="1"><stop offset="0" stop-color="#050505"/><stop offset=".25" stop-color="#1c1c1c"/><stop offset=".5" stop-color="#111"/><stop offset=".85" stop-color="#171717"/><stop offset="1" stop-color="#050505"/></linearGradient>
      <linearGradient id="s${u}" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".65"/></linearGradient>
      <linearGradient id="g${u}" x1="0" x2="1"><stop offset="0" stop-color="#7d6234"/><stop offset=".35" stop-color="#d8bf86"/><stop offset=".6" stop-color="#b8975a"/><stop offset="1" stop-color="#6f562b"/></linearGradient>
      <linearGradient id="t${u}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e3cd96"/><stop offset=".5" stop-color="#b8975a"/><stop offset="1" stop-color="#8a6d3b"/></linearGradient>
      <linearGradient id="a${u}" x1="0" x2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset=".4" stop-color="#b9b9b9"/><stop offset="1" stop-color="#454545"/></linearGradient></defs>
      <path d="${body}" fill="url(#y${u})"/>
      <g clip-path="url(#k${u})"><g transform="${side ? 'translate(76 0) scale(.5 1) translate(-60 0)' : 'translate(61.5 0) scale(.95 1) translate(-60 0)'}">${ART[concept](f, u)}</g>
        <rect x="${side ? 74 : 27}" y="30" width="4" height="126" rx="2" fill="#fff" opacity=".09"/>
        <rect x="18" y="22" width="84" height="140" fill="url(#s${u})"/></g>
      <rect x="22" y="159.5" width="76" height="3.5" rx="1.7" fill="url(#a${u})"/>
      <path d="M26 26L32 22H88L94 26" fill="none" stroke="url(#g${u})" stroke-width="1.4"/>
      <rect x="29" y="18.5" width="62" height="5.5" rx="2.5" fill="url(#g${u})"/>
      <ellipse cx="60" cy="19" rx="31" ry="5.2" fill="url(#t${u})"/><ellipse cx="60" cy="19" rx="25" ry="3.8" fill="#a98a4f" stroke="#e3cd96" stroke-width=".3"/>
      <path d="M44 19.4Q60 23.6 76 19.4" fill="none" stroke="#6f562b" stroke-width=".35"/>
      <path d="M52.5 19.4q0-3 4-3h9q3.2 0 3.2 3t-3.2 3h-9q-4 0-4-3z" fill="url(#g${u})" stroke="#6f562b" stroke-width=".3"/><ellipse cx="63" cy="19.4" rx="3" ry="1.3" fill="#2b2012"/><circle cx="55" cy="19.4" r=".9" fill="#6f562b"/></svg>`;
  }

  

  BW.can = can;
})();
