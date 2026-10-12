/*
  corvidae.tools seasonal themes.
  Picks a holiday from today's date, tints the accent color, and adds a light touch of
  animation. Loaded in <head> so there is no flash. Everything is optional: a footer link
  turns it off, and it never runs with "reduce motion" (the static decorations stay).

  Preview a season: ?theme=christmas   (names are in NAMES below)   Plain site: ?theme=off
*/
(function () {
  var root = document.documentElement;
  var KEY = 'corvidae-season';
  var NAMES = [
    'newyear', 'valentines', 'easter', 'july4', 'halloween', 'thanksgiving', 'christmas',
    'doubleten', 'dragonboat', 'midautumn', 'lunarnewyear', 'lanternfest', 'qixi'
  ];

  // Small greetings shown in the footer (Traditional Chinese, as used in Taiwan)
  var GREETING = {
    doubleten: '國慶日快樂',
    dragonboat: '端午節快樂',
    midautumn: '中秋節快樂',
    lunarnewyear: '新年快樂',
    lanternfest: '元宵節快樂',
    qixi: '七夕快樂'
  };

  // Dates of the lunar holidays, as month*100+day:
  // [Lunar New Year, Lantern Festival, Dragon Boat, Qixi, Mid-Autumn]
  // Computed from a published lunar calendar table and cross-checked against the moon's phases.
  // After the last year listed, the lunar holidays simply don't show.
  var LUNAR = {
    2025: [129, 212, 531, 829, 1006],
    2026: [217, 303, 619, 819, 925],
    2027: [206, 220, 609, 808, 915],
    2028: [126, 209, 528, 826, 1003],
    2029: [213, 227, 616, 816, 922],
    2030: [203, 217, 605, 805, 912],
    2031: [123, 206, 624, 824, 1001],
    2032: [211, 225, 612, 812, 919],
    2033: [131, 214, 601, 801, 908],
    2034: [219, 305, 620, 820, 927],
    2035: [208, 222, 610, 810, 916],
    2036: [128, 211, 530, 828, 1004],
    2037: [215, 301, 618, 817, 924],
    2038: [204, 218, 607, 807, 913],
    2039: [124, 207, 527, 826, 1002],
    2040: [212, 226, 614, 814, 920],
    2041: [201, 215, 603, 803, 910],
    2042: [122, 205, 622, 822, 928],
    2043: [210, 224, 611, 811, 917],
    2044: [130, 213, 531, 731, 1005],
    2045: [217, 303, 619, 819, 925]
  };

  // Whole days since 1970, from a calendar date. Using UTC maths keeps clock changes out of it.
  function dn(y, m, d) { return Math.floor(Date.UTC(y, m, d) / 86400000); }
  function md(y, code) { return dn(y, Math.floor(code / 100) - 1, code % 100); }

  // Easter Sunday (the standard Gregorian calculation)
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
    var f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    var month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return dn(y, month - 1, day);
  }

  // Thanksgiving: the fourth Thursday of November
  function thanksgiving(y) {
    var first = new Date(Date.UTC(y, 10, 1)).getUTCDay();
    return dn(y, 10, 1 + ((4 - first + 7) % 7) + 21);
  }

  function seasonFor(now) {
    var y = now.getFullYear();
    var t = dn(y, now.getMonth(), now.getDate());
    function within(a, b) { return t >= a && t <= b; }
    var L = LUNAR[y];
    if (L) {
      var lny = md(y, L[0]);
      if (within(lny - 1, lny + 4)) return 'lunarnewyear';
      if (within(md(y, L[1]) - 1, md(y, L[1]))) return 'lanternfest';
      if (within(md(y, L[2]) - 3, md(y, L[2]))) return 'dragonboat';
      if (within(md(y, L[3]) - 1, md(y, L[3]))) return 'qixi';
      if (within(md(y, L[4]) - 5, md(y, L[4]))) return 'midautumn';
    }
    if (within(dn(y, 9, 5), dn(y, 9, 10))) return 'doubleten';
    if (within(dn(y, 0, 1), dn(y, 0, 3)) || within(dn(y, 11, 30), dn(y, 11, 31))) return 'newyear';
    if (within(dn(y, 1, 7), dn(y, 1, 14))) return 'valentines';
    var es = easter(y);
    if (within(es - 7, es + 1)) return 'easter';
    if (within(dn(y, 6, 1), dn(y, 6, 4))) return 'july4';
    if (within(dn(y, 9, 24), dn(y, 9, 31))) return 'halloween';
    var tg = thanksgiving(y);
    if (within(tg - 9, tg)) return 'thanksgiving';
    if (within(dn(y, 11, 1), dn(y, 11, 26))) return 'christmas';
    return '';
  }

  // ?theme=christmas previews a season; ?theme=off shows the plain site
  var season = seasonFor(new Date());
  var forced = /[?&]theme=([a-z0-9]+)/.exec(location.search);
  if (forced) season = NAMES.indexOf(forced[1]) >= 0 ? forced[1] : '';

  function optedOut() {
    try { return localStorage.getItem(KEY) === 'off'; } catch (e) { return false; }
  }
  if (season && !optedOut()) root.setAttribute('data-season', season);
  if (!season) return;

  // ---------- decorations (drawn in code, no images) ----------
  var SVGNS = 'http://www.w3.org/2000/svg';
  var scenery = [];

  function svg(cls, viewBox, inner) {
    var el = document.createElementNS(SVGNS, 'svg');
    el.setAttribute('class', 'season-deco ' + cls);
    el.setAttribute('viewBox', viewBox);
    el.setAttribute('aria-hidden', 'true');
    el.setAttribute('focusable', 'false');
    el.innerHTML = inner;
    document.body.appendChild(el);
    scenery.push(el);
    return el;
  }

  // Coded fallback Taipei 101, used only if the artwork fails to load
  function towerCoded() {
    var parts = [];
    var i, y0, tw, bw, x;
    parts.push('<defs><linearGradient id="t101g" x1="0" x2="1"><stop offset="0" stop-color="#58c4d3"/><stop offset="0.55" stop-color="#2f93a6"/><stop offset="1" stop-color="#1d6477"/></linearGradient></defs>');
    parts.push('<line x1="60" y1="2" x2="60" y2="62" stroke="#f2c94c" stroke-width="3" stroke-linecap="round"/><circle cx="60" cy="3" r="3" fill="#ff6b6b"/>');
    parts.push('<polygon points="52,90 68,90 71,62 49,62" fill="url(#t101g)" stroke="#0b2530" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<polygon points="49,118 71,118 74,90 46,90" fill="url(#t101g)" stroke="#0b2530" stroke-width="1.6" stroke-linejoin="round"/>');
    for (i = 0; i < 8; i++) {
      y0 = 118 + i * 40;
      tw = 22 + i * 1.9;
      bw = tw - 7;
      parts.push('<polygon points="' + (60 - tw) + ',' + y0 + ' ' + (60 + tw) + ',' + y0 + ' ' + (60 + bw) + ',' + (y0 + 40) + ' ' + (60 - bw) + ',' + (y0 + 40) + '" fill="url(#t101g)" stroke="#0b2530" stroke-width="1.6" stroke-linejoin="round"/>');
      parts.push('<line x1="' + (60 - tw + 1) + '" y1="' + (y0 + 1.5) + '" x2="' + (60 + tw - 1) + '" y2="' + (y0 + 1.5) + '" stroke="#f2c94c" stroke-width="1.6" stroke-linecap="round"/>');
      parts.push('<polygon points="' + (60 - tw + 3) + ',' + (y0 + 4) + ' ' + (60 - tw + 8) + ',' + (y0 + 4) + ' ' + (60 - bw + 6) + ',' + (y0 + 38) + ' ' + (60 - bw + 2) + ',' + (y0 + 38) + '" fill="#9ae3ee" opacity="0.35"/>');
      for (x = -2; x <= 2; x += 2) {
        parts.push('<rect class="t101w" style="animation-delay:-' + ((i * 5 + x + 3) % 7) * 0.7 + 's" x="' + (59 + x * 6.5) + '" y="' + (y0 + 14) + '" width="3" height="8" rx="1" fill="#ffe08a"/>');
      }
    }
    parts.push('<polygon points="30,438 90,438 90,462 30,462" fill="#1d6477" stroke="#0b2530" stroke-width="1.6" stroke-linejoin="round"/>');
    parts.push('<rect x="8" y="462" width="104" height="18" rx="2" fill="#17505f" stroke="#0b2530" stroke-width="1.6"/>');
    svg('season-tower', '0 0 120 480', parts.join(''));
  }

  // Taipei 101 artwork; falls back to the coded drawing if the image is missing
  function tower() {
    var img = document.createElement('img');
    img.className = 'season-deco season-tower season-tower-img';
    img.alt = '';
    img.setAttribute('aria-hidden', 'true');
    img.decoding = 'async';
    img.src = '/taipei-101.webp';
    img.onerror = function () {
      var i = scenery.indexOf(img);
      if (i >= 0) scenery.splice(i, 1);
      if (img.parentNode) img.parentNode.removeChild(img);
      towerCoded();
    };
    document.body.appendChild(img);
    scenery.push(img);
  }

  // A dragon boat with a drummer and paddlers, sailing slowly along the bottom of the page
  function boat() {
    var p = [];
    var i;
    p.push('<g class="season-bob">');
    p.push('<path d="M14,52 Q40,72 130,72 Q215,72 238,48 L226,45 Q204,60 130,60 Q56,60 24,47 Z" fill="#c8372d" stroke="#3a0d0a" stroke-width="1.6" stroke-linejoin="round"/>');
    p.push('<path d="M26,56 Q130,66 224,54" fill="none" stroke="#f2c94c" stroke-width="2" stroke-linecap="round"/>');
    p.push('<path d="M236,48 Q246,40 244,30 Q256,30 258,40 Q260,50 246,52 Z" fill="#37b36b" stroke="#0e3a22" stroke-width="1.6" stroke-linejoin="round"/>');
    p.push('<circle cx="251" cy="37" r="1.8" fill="#fff"/><circle cx="251.4" cy="37" r="0.9" fill="#111"/>');
    p.push('<path d="M246,28 L242,18 M250,28 L252,17" stroke="#f2c94c" stroke-width="2" stroke-linecap="round"/>');
    p.push('<path d="M14,52 Q4,50 6,38 Q14,44 20,46" fill="#37b36b" stroke="#0e3a22" stroke-width="1.6" stroke-linejoin="round"/>');
    for (i = 0; i < 8; i++) {
      var x = 40 + i * 22;
      p.push('<circle cx="' + x + '" cy="38" r="4" fill="#f5e6c8" stroke="#3a0d0a" stroke-width="1"/>');
      p.push('<rect x="' + (x - 3.5) + '" y="42" width="7" height="12" rx="2" fill="' + (i % 2 ? '#ffd166' : '#ffffff') + '" stroke="#3a0d0a" stroke-width="1"/>');
      p.push('<line class="season-oar" style="animation-delay:-' + (i % 4) * 0.3 + 's" x1="' + x + '" y1="46" x2="' + (x - 11) + '" y2="66" stroke="#e7c58a" stroke-width="2" stroke-linecap="round"/>');
    }
    p.push('<circle cx="128" cy="32" r="8" fill="#c8372d" stroke="#3a0d0a" stroke-width="1.4"/><circle cx="128" cy="32" r="3" fill="#f2c94c"/>');
    p.push('</g>');
    p.push('<path d="M0,76 q10,-5 20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0 t20,0" fill="none" stroke="#6fd0e8" stroke-width="2" opacity="0.7"/>');
    svg('season-boat', '0 0 264 84', p.join(''));
  }

  // A big, soft full moon
  function moon() {
    svg('season-moon', '0 0 220 220',
      '<defs><radialGradient id="mg" cx="0.45" cy="0.42" r="0.6"><stop offset="0" stop-color="#fffbe8"/><stop offset="0.7" stop-color="#ffe6a3"/><stop offset="1" stop-color="#f2c261"/></radialGradient>' +
      '<radialGradient id="mh" cx="0.5" cy="0.5" r="0.5"><stop offset="0.6" stop-color="#ffe6a3" stop-opacity="0.45"/><stop offset="1" stop-color="#ffe6a3" stop-opacity="0"/></radialGradient></defs>' +
      '<circle cx="110" cy="110" r="108" fill="url(#mh)"/><circle cx="110" cy="110" r="84" fill="url(#mg)"/>' +
      '<ellipse cx="86" cy="92" rx="16" ry="12" fill="#d9a548" opacity="0.28"/><ellipse cx="130" cy="130" rx="20" ry="14" fill="#d9a548" opacity="0.24"/>' +
      '<ellipse cx="118" cy="78" rx="9" ry="7" fill="#d9a548" opacity="0.22"/><ellipse cx="82" cy="136" rx="11" ry="8" fill="#d9a548" opacity="0.2"/>');
  }

  // Two red lanterns that sway at the top corners
  function lanterns() {
    var body = function (side) {
      return '<g class="season-sway">' +
        '<line x1="30" y1="0" x2="30" y2="22" stroke="#f2c94c" stroke-width="2"/>' +
        '<rect x="20" y="22" width="20" height="5" rx="2" fill="#f2c94c"/>' +
        '<ellipse cx="30" cy="48" rx="24" ry="22" fill="#d62f2f" stroke="#5a0f0f" stroke-width="1.6"/>' +
        '<path d="M30,26 Q16,48 30,70 M30,26 Q44,48 30,70" fill="none" stroke="#f26a5a" stroke-width="1.4" opacity="0.75"/>' +
        '<text x="30" y="55" text-anchor="middle" font-size="20" font-weight="700" fill="#f2c94c" lang="zh-Hant">福</text>' +
        '<rect x="20" y="69" width="20" height="5" rx="2" fill="#f2c94c"/>' +
        '<path d="M26,74 L24,92 M30,74 L30,96 M34,74 L36,92" stroke="#f2c94c" stroke-width="1.6" stroke-linecap="round"/></g>';
    };
    svg('season-lantern season-lantern-l', '0 0 60 100', body('l'));
    svg('season-lantern season-lantern-r', '0 0 60 100', body('r'));
  }

  // Star of Bethlehem: a long four-point star with a soft glow, top corner
  function star() {
    svg('season-star', '0 0 120 140',
      '<defs><radialGradient id="sg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#fff3b0" stop-opacity="0.75"/><stop offset="0.45" stop-color="#ffd25a" stop-opacity="0.25"/><stop offset="1" stop-color="#ffd25a" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="sb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe9a0" stop-opacity="0.35"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></linearGradient></defs>' +
      '<g class="season-star-pulse">' +
      '<circle cx="60" cy="62" r="60" fill="url(#sg)"/>' +
      '<polygon points="52,66 68,66 76,140 44,140" fill="url(#sb)"/>' +
      '<polygon points="60,4 67.5,54.5 108,62 67.5,69.5 60,126 52.5,69.5 12,62 52.5,54.5" fill="#ffe27a" stroke="#c9962b" stroke-width="1.2" stroke-linejoin="round"/>' +
      '<polygon points="60,62 83,39 66,60 83,85 60,64 37,85 54,60 37,39" fill="#fff4c4" opacity="0.8"/>' +
      '<circle cx="60" cy="62" r="5" fill="#fffdf0"/></g>');
  }

  // Three crosses on a hill at dawn, bottom corner
  function crosses() {
    var cross = function (x, y, h, w) {
      var a = h * 0.3;
      return '<rect x="' + (x - w / 2) + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.2" fill="#f4ead2" stroke="#6b5a3a" stroke-width="0.8"/>' +
        '<rect x="' + (x - h * 0.22) + '" y="' + (y + a) + '" width="' + (h * 0.44) + '" height="' + w + '" rx="1.2" fill="#f4ead2" stroke="#6b5a3a" stroke-width="0.8"/>';
    };
    svg('season-crosses', '0 0 240 130',
      '<defs><radialGradient id="cg" cx="0.5" cy="1" r="0.8"><stop offset="0" stop-color="#ffe9a8" stop-opacity="0.7"/><stop offset="0.5" stop-color="#d9c2ff" stop-opacity="0.22"/><stop offset="1" stop-color="#d9c2ff" stop-opacity="0"/></radialGradient>' +
      '<linearGradient id="ch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4490"/><stop offset="1" stop-color="#2a1f4a"/></linearGradient></defs>' +
      '<ellipse cx="120" cy="124" rx="118" ry="104" fill="url(#cg)"/>' +
      '<path d="M0,130 Q20,112 60,106 Q100,98 120,98 Q150,98 190,106 Q226,112 240,130 Z" fill="url(#ch)" stroke="#8a74c4" stroke-width="1.2"/>' +
      cross(78, 52, 50, 6) + cross(162, 52, 50, 6) + cross(120, 34, 66, 7.5));
  }

  function mountScenery() {
    unmountScenery();
    if (season === 'doubleten') tower();
    else if (season === 'dragonboat') boat();
    else if (season === 'midautumn') moon();
    else if (season === 'lunarnewyear') lanterns();
    else if (season === 'christmas') star();
    else if (season === 'easter') crosses();
    var g = document.getElementById('season-greeting');
    if (g) {
      g.textContent = GREETING[season] || '';
      g.hidden = !GREETING[season];
    }
  }

  function unmountScenery() {
    while (scenery.length) {
      var el = scenery.pop();
      if (el.parentNode) el.parentNode.removeChild(el);
    }
    var g = document.getElementById('season-greeting');
    if (g) g.hidden = true;
  }

  // ---------- falling things ----------
  var canvas = null, ctx = null, parts = [], raf = 0, last = 0, w = 0, h = 0, dpr = 1, running = false;
  var slow = 0, throttled = false, nextBurst = 0, nextStar = 2, tsec = 0;
  var rm = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  var LEAF = ['#d9822b', '#b5461f', '#e8b23a', '#8c4a1c', '#c8641e'];
  var PETAL = ['#f7c6dc', '#d9c2ff', '#bfeadc', '#fff0b3', '#ffd5c2'];
  var CONFETTI = ['#f2c94c', '#e8e8ea', '#d9b45a', '#fff4c9', '#b8b8bf'];
  var HEART = ['#ff7eb6', '#ff5a8a', '#ffa3c7', '#e8456f'];
  var SPARK = ['#ff5a5f', '#f5f5f7', '#5aa0ff'];
  var TW_SPARK = ['#ff5a5f', '#f5f5f7', '#5aa0ff', '#f2c94c'];
  var PAPER = ['#e8503a', '#ff9a3c', '#d62f2f', '#ffb347'];

  function count() {
    var n = Math.round((w * h) / 30000);
    if (w < 600) n = Math.round(n * 0.65);
    n = Math.max(16, Math.min(70, n));
    return throttled ? Math.round(n / 2) : n;
  }

  function spawn(initial) {
    var p = { x: rnd(0, w), y: initial ? rnd(0, h) : rnd(-30, -5), ph: rnd(0, 6.28), rot: rnd(0, 6.28), a: 1, life: 0 };
    switch (season) {
      case 'christmas':
        p.s = rnd(1.2, 3.6); p.vy = rnd(22, 55) * (0.4 + p.s / 4); p.vx = rnd(-6, 6); p.a = rnd(0.45, 0.9); break;
      case 'thanksgiving':
        p.s = rnd(5, 9); p.vy = rnd(26, 50); p.vx = rnd(-14, 14); p.vr = rnd(-1.5, 1.5); p.c = pick(LEAF); p.a = 0.85; break;
      case 'easter':
        p.s = rnd(4, 7); p.vy = rnd(20, 38); p.vx = rnd(-10, 10); p.vr = rnd(-1.2, 1.2); p.c = pick(PETAL); p.a = 0.8; break;
      case 'newyear':
        p.s = rnd(3, 5.5); p.vy = rnd(45, 85); p.vx = rnd(-18, 18); p.vr = rnd(-4, 4); p.c = pick(CONFETTI); p.a = 0.9; break;
      case 'valentines':
        p.y = initial ? rnd(0, h) : h + rnd(5, 30);
        p.s = rnd(5, 10); p.vy = -rnd(22, 48); p.vx = rnd(-8, 8); p.c = pick(HEART); p.a = rnd(0.45, 0.8); break;
      case 'halloween':
        if (Math.random() < 0.2) { // a bat
          p.bat = true; p.s = rnd(7, 11); p.vx = rnd(35, 70) * (Math.random() < 0.5 ? -1 : 1); p.y = rnd(30, h * 0.6); p.x = initial ? rnd(0, w) : (p.vx > 0 ? -20 : w + 20); p.vy = 0; p.base = p.y;
        } else { // an ember drifting up
          p.y = initial ? rnd(0, h) : h + rnd(5, 30);
          p.s = rnd(1, 2.6); p.vy = -rnd(14, 38); p.vx = rnd(-6, 6); p.a = rnd(0.4, 0.9);
        }
        break;
      case 'dragonboat': // zongzi falling
        p.s = rnd(6, 10); p.vy = rnd(24, 44); p.vx = rnd(-10, 10); p.vr = rnd(-0.9, 0.9); p.a = 0.9; break;
      case 'lunarnewyear': // gold coins
        p.s = rnd(4, 6.5); p.vy = rnd(38, 75); p.vx = rnd(-12, 12); p.a = 0.95; break;
      case 'midautumn': // paper lanterns drifting up
        p.y = initial ? rnd(0, h) : h + rnd(10, 60);
        p.s = rnd(7, 12); p.vy = -rnd(12, 26); p.vx = rnd(-5, 5); p.c = pick(PAPER); p.a = 0.9; break;
      case 'lanternfest': // sky lanterns rising
        p.y = initial ? rnd(h * 0.2, h) : h + rnd(10, 60);
        p.s = rnd(8, 14); p.vy = -rnd(10, 22); p.vx = rnd(-4, 4); p.a = 0.95; break;
      case 'qixi': // stars
        p.s = rnd(0.7, 1.8); p.vy = 0; p.vx = 0; p.star = true; p.y = rnd(0, h); break;
    }
    return p;
  }

  function burst(cx, cy, palette, n) {
    var c = pick(palette), i, ang, sp;
    for (i = 0; i < n; i++) {
      ang = (i / n) * 6.283 + rnd(-0.08, 0.08); sp = rnd(60, 150);
      parts.push({ fx: true, x: cx, y: cy, px: cx, py: cy, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, s: rnd(1.2, 2.2), c: Math.random() < 0.25 ? '#f5f5f7' : c, life: rnd(0.9, 1.5), age: 0 });
    }
  }

  // Rockets that climb out of the Taipei 101 spire area, then burst
  function rocket() {
    var el = scenery[0];
    var r = el && el.getBoundingClientRect ? el.getBoundingClientRect() : null;
    var x, y;
    if (r && r.height > 0) { x = r.left + r.width * 0.5 + rnd(-r.width * 0.15, r.width * 0.15); y = r.top + r.height * rnd(0.02, 0.12); }
    else { x = w - 40; y = h * 0.6; }
    var tx = x + rnd(-170, 80), ty = Math.max(60, y - rnd(110, 260));
    var T = rnd(0.7, 1.1);
    parts.push({ rocket: true, x: x, y: y, px: x, py: y, vx: (tx - x) / T, vy: (ty - y) / T, age: 0, life: T, s: 1.6, c: '#ffe9a8' });
  }

  function fill() {
    parts = [];
    if (season === 'july4' || season === 'doubleten') return;
    var n = count();
    if (season === 'midautumn' || season === 'lanternfest') n = Math.max(8, Math.round(n * 0.4));
    if (season === 'qixi') n = Math.round(n * 1.2);
    for (var i = 0; i < n; i++) parts.push(spawn(true));
  }

  function heart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.35);
    ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.55, -s * 1.1, 0, -s * 0.55);
    ctx.bezierCurveTo(s * 0.55, -s * 1.1, s, -s * 0.4, 0, s * 0.35);
    ctx.fill();
  }

  function bat(p, t) {
    var flap = 0.35 + 0.65 * Math.abs(Math.sin(t * 9 + p.ph)), s = p.s;
    ctx.scale(p.vx < 0 ? -1 : 1, 1);
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.25);
    ctx.quadraticCurveTo(s * 0.6, -s * (0.9 * flap + 0.2), s * 1.6, -s * 0.2 * flap);
    ctx.quadraticCurveTo(s * 1.1, s * 0.05, s * 0.7, s * 0.35);
    ctx.quadraticCurveTo(s * 0.35, s * 0.1, 0, s * 0.45);
    ctx.quadraticCurveTo(-s * 0.35, s * 0.1, -s * 0.7, s * 0.35);
    ctx.quadraticCurveTo(-s * 1.1, s * 0.05, -s * 1.6, -s * 0.2 * flap);
    ctx.quadraticCurveTo(-s * 0.6, -s * (0.9 * flap + 0.2), 0, -s * 0.25);
    ctx.fill();
  }

  function zongzi(s) { // a pyramid dumpling tied with string
    ctx.fillStyle = '#4fae6a';
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.95, s * 0.7); ctx.quadraticCurveTo(0, s * 1.05, -s * 0.95, s * 0.7); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#2f7c47'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(0, s * 0.85); ctx.stroke();
    ctx.strokeStyle = '#e8503a'; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(-s * 0.5, s * 0.1); ctx.lineTo(s * 0.5, s * 0.1); ctx.stroke();
  }

  function coin(p) {
    var f = Math.abs(Math.cos(p.ph * 2.2));
    ctx.scale(Math.max(0.15, f), 1);
    ctx.fillStyle = '#f2c94c'; ctx.beginPath(); ctx.arc(0, 0, p.s, 0, 6.283); ctx.fill();
    ctx.strokeStyle = '#b8892a'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, 0, p.s * 0.72, 0, 6.283); ctx.stroke();
    ctx.fillStyle = '#b8892a'; ctx.fillRect(-p.s * 0.2, -p.s * 0.2, p.s * 0.4, p.s * 0.4);
  }

  function paperLantern(p) {
    var s = p.s;
    ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.arc(0, 0, s * 1.9, 0, 6.283); ctx.fill();
    ctx.globalAlpha = p.a;
    ctx.fillStyle = '#f2c94c'; ctx.fillRect(-s * 0.35, -s * 0.95, s * 0.7, s * 0.25);
    ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, s * 0.85, s * 0.7, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = 'rgba(255,230,160,0.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(0, 0, s * 0.35, s * 0.7, 0, 0, 6.283); ctx.stroke();
    ctx.fillStyle = '#f2c94c'; ctx.fillRect(-s * 0.35, s * 0.7, s * 0.7, s * 0.2);
    ctx.strokeStyle = '#f2c94c'; ctx.beginPath(); ctx.moveTo(0, s * 0.9); ctx.lineTo(0, s * 1.45); ctx.stroke();
  }

  function skyLantern(p) {
    var s = p.s;
    ctx.globalAlpha = 0.25; ctx.fillStyle = '#ffb347'; ctx.beginPath(); ctx.arc(0, s * 0.2, s * 1.7, 0, 6.283); ctx.fill();
    ctx.globalAlpha = p.a * p.fade;
    ctx.fillStyle = '#ffb34f'; ctx.beginPath(); ctx.moveTo(-s * 0.5, -s * 0.8); ctx.lineTo(s * 0.5, -s * 0.8); ctx.lineTo(s * 0.7, s * 0.8); ctx.lineTo(-s * 0.7, s * 0.8); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(160,70,20,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -s * 0.8); ctx.lineTo(0, s * 0.8); ctx.stroke();
    ctx.fillStyle = '#fff1b8'; ctx.beginPath(); ctx.ellipse(0, s * 0.82, s * 0.28, s * 0.2, 0, 0, 6.283); ctx.fill();
  }

  function step(now) {
    raf = requestAnimationFrame(step);
    var dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now; tsec += dt;
    // if the device is struggling, thin out the effect, then stop it
    if (dt > 0.04) { if (++slow > 90) { slow = 0; if (!throttled) { throttled = true; fill(); } else { stop(true); return; } } } else if (slow > 0) slow--;

    ctx.clearRect(0, 0, w, h);
    if (season === 'july4' && tsec > nextBurst && parts.length < 260) {
      burst(rnd(w * 0.12, w * 0.88), rnd(h * 0.1, h * 0.5), SPARK, 26); nextBurst = tsec + rnd(0.9, 1.8);
    }
    if (season === 'doubleten' && tsec > nextBurst && parts.length < 320) { rocket(); nextBurst = tsec + rnd(0.5, 1.2); }
    if (season === 'qixi' && tsec > nextStar) {
      parts.push({ shoot: true, x: rnd(w * 0.3, w), y: rnd(0, h * 0.35), vx: -rnd(380, 520), vy: rnd(150, 240), age: 0, life: 0.7 }); nextStar = tsec + rnd(3, 6);
    }
    for (var i = parts.length - 1; i >= 0; i--) {
      var p = parts[i];
      if (p.rocket) {
        p.age += dt; p.px = p.x; p.py = p.y; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = 0.9; ctx.strokeStyle = p.c; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(p.px - p.vx * dt * 2.5, p.py - p.vy * dt * 2.5); ctx.lineTo(p.x, p.y); ctx.stroke();
        if (p.age >= p.life) { parts.splice(i, 1); burst(p.x, p.y, TW_SPARK, 30); }
        continue;
      }
      if (p.fx) {
        p.age += dt; if (p.age > p.life) { parts.splice(i, 1); continue; }
        p.px = p.x; p.py = p.y; p.vy += 70 * dt; p.vx *= 0.985; p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = Math.max(0, 1 - p.age / p.life);
        ctx.strokeStyle = p.c; ctx.fillStyle = p.c; ctx.lineWidth = p.s;
        ctx.beginPath(); ctx.moveTo(p.px, p.py); ctx.lineTo(p.x, p.y); ctx.stroke();
        continue;
      }
      if (p.shoot) {
        p.age += dt; if (p.age > p.life) { parts.splice(i, 1); continue; }
        p.x += p.vx * dt; p.y += p.vy * dt;
        ctx.globalAlpha = 1 - p.age / p.life; ctx.strokeStyle = '#f3e8ff'; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 0.09, p.y - p.vy * 0.09); ctx.stroke();
        continue;
      }
      if (p.star) {
        p.ph += dt * 1.6;
        ctx.globalAlpha = 0.25 + 0.65 * Math.abs(Math.sin(p.ph));
        ctx.fillStyle = '#f3e8ff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill();
        continue;
      }
      p.ph += dt * 1.4;
      if (p.vr) p.rot += p.vr * dt;
      if (p.bat) {
        p.x += p.vx * dt; p.y = p.base + Math.sin(p.ph * 1.6) * 18;
        if ((p.vx > 0 && p.x > w + 30) || (p.vx < 0 && p.x < -30)) { parts[i] = spawn(false); continue; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.globalAlpha = 0.85; ctx.fillStyle = '#8a6bd1'; bat(p, tsec); ctx.restore();
        continue;
      }
      p.x += (p.vx + Math.sin(p.ph) * (season === 'christmas' ? 12 : 9)) * dt;
      p.y += p.vy * dt;
      var gone = p.vy < 0 ? p.y < -40 : p.y > h + 30;
      if (gone) { parts[i] = spawn(false); continue; }
      ctx.globalAlpha = p.a;
      switch (season) {
        case 'christmas':
          ctx.fillStyle = '#ffffff'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill(); break;
        case 'halloween':
          ctx.globalAlpha = p.a * (0.6 + 0.4 * Math.sin(p.ph * 3));
          ctx.fillStyle = '#ff8a3d'; ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill(); break;
        case 'thanksgiving':
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.55, 0, 0, 6.283); ctx.fill();
          ctx.strokeStyle = p.c; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-p.s, 0); ctx.lineTo(-p.s - 3, 0); ctx.stroke();
          ctx.restore(); break;
        case 'easter':
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
          ctx.beginPath(); ctx.ellipse(0, 0, p.s, p.s * 0.6, 0, 0, 6.283); ctx.fill(); ctx.restore(); break;
        case 'newyear':
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.cos(p.ph * 2.5)); ctx.fillStyle = p.c;
          ctx.fillRect(-p.s, -p.s * 0.4, p.s * 2, p.s * 0.8); ctx.restore(); break;
        case 'valentines':
          ctx.save(); ctx.translate(p.x, p.y); ctx.fillStyle = p.c; heart(p.s); ctx.restore(); break;
        case 'dragonboat':
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(Math.sin(p.ph) * 0.5 + p.rot * 0.1); zongzi(p.s); ctx.restore(); break;
        case 'lunarnewyear':
          ctx.save(); ctx.translate(p.x, p.y); coin(p); ctx.restore(); break;
        case 'midautumn':
          ctx.save(); ctx.translate(p.x, p.y); paperLantern(p); ctx.restore(); break;
        case 'lanternfest':
          p.fade = Math.max(0, Math.min(1, p.y / (h * 0.25)));
          ctx.save(); ctx.translate(p.x, p.y); skyLantern(p); ctx.restore(); break;
      }
    }
    ctx.globalAlpha = 1;
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function start() {
    if (running || (rm && rm.matches) || document.hidden) return;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'season-canvas';
      canvas.setAttribute('aria-hidden', 'true');
      document.body.appendChild(canvas);
      ctx = canvas.getContext('2d');
      if (!ctx) { canvas = null; return; }
      size();
      var rt;
      window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (canvas) { size(); fill(); } }, 200); });
    }
    if (!parts.length) fill();
    running = true; last = performance.now();
    raf = requestAnimationFrame(step);
  }

  function stop(clear) {
    running = false; cancelAnimationFrame(raf);
    if (clear && ctx) { ctx.clearRect(0, 0, w, h); parts = []; }
  }

  // ---------- on/off switch in the footer ----------
  function wire() {
    var btn = document.getElementById('season-toggle');
    function paint() { if (btn) btn.textContent = 'seasonal theme: ' + (root.hasAttribute('data-season') ? 'on' : 'off'); }
    if (btn) {
      btn.hidden = false; paint();
      btn.addEventListener('click', function () {
        var on = root.hasAttribute('data-season');
        try { localStorage.setItem(KEY, on ? 'off' : 'on'); } catch (e) { /* the choice just won't be remembered */ }
        if (on) { root.removeAttribute('data-season'); stop(true); unmountScenery(); }
        else { root.setAttribute('data-season', season); mountScenery(); start(); }
        paint();
      });
    }
    if (root.hasAttribute('data-season')) { mountScenery(); start(); }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(false);
      else if (root.hasAttribute('data-season')) start();
    });
    if (rm && rm.addEventListener) rm.addEventListener('change', function () {
      if (rm.matches) stop(true); else if (root.hasAttribute('data-season')) start();
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire); else wire();
})();
