/* BEARWICK: the can design (Modern Heritage) in both flavours, with front + side-angle mockups.
   Artwork only: no ABV, nutrition, prices or availability claims. */
(function () {
  const CR = '#efe3cf', BR = '#b8975a', INK = '#0e0e0e', FF = 'Verdana,Geneva,sans-serif';
  let uid = 0;
  const BW = window.BW = { can: null, abv: '4.2% ABV' };   // abv: intended strength, shown on every can and in the shop text
  const T = (x, y, s, sz, fill, ls = 0) => ['#000', fill].map((c, i) =>
    `<text x="${x}" y="${y + (i ? 0 : .5)}" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="${sz}" letter-spacing="${ls}" fill="${c}"${i ? '' : ' opacity=".55"'}>${s}</text>`).join('');
  const GOLD = '#c9a96a', DK = '#14110f';
  const berry = (x, y, r, fill) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${GOLD}" stroke-width=".35"/><ellipse cx="${x - r * .35}" cy="${y - r * .42}" rx="${r * .32}" ry="${r * .18}" fill="#fff" opacity=".6" transform="rotate(-30 ${x} ${y})"/><circle cx="${x + r * .1}" cy="${y + r * .75}" r=".35" fill="${GOLD}"/>`;
  const leaf = (x, y, rot, s) => `<path d="M0 0Q${3 * s} ${-3 * s} ${8 * s} 0Q${3 * s} ${3 * s} 0 0ZM0 0L${7 * s} 0" transform="translate(${x} ${y}) rotate(${rot})" fill="#1a281c" stroke="${GOLD}" stroke-width=".45"/>`;
  const stem = (d, w = .7) => `<path d="${d}" fill="none" stroke="${GOLD}" stroke-width="${w}" stroke-linecap="round"/>`;
  const pod = (d) => `<path d="${d}" fill="none" stroke="#4a3320" stroke-width="1.9" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${GOLD}" stroke-width=".4" stroke-linecap="round" transform="translate(.5 -.4)"/>`;
  const wreath = (id) => id === 'cherry'
    ? stem('M40 78Q36 66 38 54M46.5 80Q40 68 38 54') + leaf(38, 56, 215, 1.1) + leaf(38.5, 62, 160, .9) + berry(40, 81, 3.4, '#d02a48') + berry(46.8, 83, 3.4, '#d02a48')
      + pod('M76 85Q89 70 83 52') + pod('M73 85Q92 69 87 55') + `<g fill="${CR}" stroke="${GOLD}" stroke-width=".3">${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="84" cy="49" rx=".9" ry="1.8" transform="rotate(${a} 84 51)"/>`).join('')}</g>`
    : stem('M46 85Q34 73 36 52M74 85Q86 73 84 52') + leaf(36.5, 58, 205, 1) + leaf(35.5, 66, 215, 1) + leaf(40, 76, 170, .9) + leaf(84, 58, -25, 1) + leaf(85, 66, -35, 1)
      + berry(40, 81, 2.9, '#7a45d6') + berry(44.5, 84, 2.7, '#7a45d6') + berry(36.5, 77, 2.5, '#7a45d6') + berry(84, 53, 2.7, '#7a45d6') + berry(80.8, 57.5, 2.6, '#7a45d6') + berry(86.5, 58, 2.3, '#7a45d6');
  const LAY = {
    blackcurrant: [['BLACKCURRANT', 6.6, .5, 111, 1], ['STOUT', 5.4, 3, 121, 0]],
    cherry: [['CHERRY &', 7.4, .6, 110.5, 1], ['VANILLA', 7.4, .6, 119.5, 0], ['STOUT', 5.2, 3, 128.5, 0]]
  };

  /* A: Modern heritage for a short, wide 330ml can (artwork area ~72 x 118). Matte black label, gold frame, spot-gloss on gold + fruit highlights. */
  const A = (f, u) => `<defs><linearGradient id="sp${u}" x1="0" y1="0" x2="1" y2="1"><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset=".65" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
    <rect x="24" y="34" width="72" height="116" rx="5" fill="none" stroke="${GOLD}" stroke-width=".8"/><rect x="24" y="34" width="72" height="116" rx="5" fill="none" stroke="url(#sp${u})" stroke-width=".8"/>
    <rect x="26.2" y="36.2" width="67.6" height="111.6" rx="3.5" fill="none" stroke="${GOLD}" stroke-width=".25" opacity=".7"/>
    <text x="60" y="44.5" text-anchor="middle" font-family="${FF}" font-size="3" fill="${GOLD}" letter-spacing="1.8">WARWICKSHIRE</text>
    ${wreath(f.id)}<mask id="bm${u}"><image href="assets/bear-emblem.png" x="41.9" y="46.4" width="36" height="35.5"/></mask>
    <image href="assets/bear-emblem.png" x="41.9" y="46.4" width="36" height="35.5"/><rect x="41.9" y="46.4" width="36" height="35.5" fill="url(#sp${u})" mask="url(#bm${u})"/>
    ${T(60, 95, 'BEARWICK', 8.6, CR, 1.1)}<path d="M45 99.5H75" stroke="${GOLD}" stroke-width=".5"/><path d="M60 97.6l1.9 1.9-1.9 1.9-1.9-1.9z" fill="${GOLD}"/>
    ${LAY[f.id].map(([t, sz, ls, y, acc]) => T(60, y, t, sz, acc ? f.color : CR, ls)).join('')}
    <rect x="30" y="133.4" width="60" height="2" fill="${f.can}"/><rect x="30" y="133.4" width="60" height="2" fill="url(#sp${u})" opacity=".6"/>
    <text x="60" y="143.5" text-anchor="middle" font-family="${FF}" font-weight="700" font-size="4.4" fill="${CR}" letter-spacing=".8">${BW.abv}</text>
    <text x="60" y="155.2" text-anchor="middle" font-family="${FF}" font-size="2.3" fill="${CR}" opacity=".45" letter-spacing="1.2">CONCEPT DESIGN</text>`;

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
        <rect x="${side ? 74 : 27}" y="30" width="4" height="126" rx="2" fill="#fff" opacity=".035"/>
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
