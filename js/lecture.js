/* Wakf — Lecture classique (style quran.com, maquette M1)
   Texte et découpage des mots : api.quran.com · récitation : Mishary Alafasy (quran.com) · traduction : quran.com (sans mention).
   W.renderReading(n, info, gloss) → élément de page. W.openSurahSheet(n, info) → fenêtre « Lecture classique / Mind map ». */
(function () {
  'use strict';
  const { h } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const T = {
    fr: { per: 'Versets', page: 'Page', prev: 'Précédente', next: 'Suivante', listen: 'Écouter la sourate', listenV: 'Écouter ce verset', repeat: 'Répéter ce verset', copy: 'Copier le texte arabe', copied: 'Verset copié', map: 'Voir dans la mind map', more: 'Plus d’options', pause: 'Pause', play: 'Lecture', close: 'Fermer', trErr: 'Traduction indisponible hors connexion.', read: 'Lecture classique', readSub: 'Verset par verset, avec la traduction', mm: 'Mind map', mmSub: (k) => k + ' thèmes en cartes mentales', surah: (n) => 'Sourate ' + n, verse: 'Verset' },
    en: { per: 'Verses', page: 'Page', prev: 'Previous', next: 'Next', listen: 'Listen to the surah', listenV: 'Listen to this verse', repeat: 'Repeat this verse', copy: 'Copy the Arabic text', copied: 'Verse copied', map: 'See in the mind map', more: 'More options', pause: 'Pause', play: 'Play', close: 'Close', trErr: 'Translation unavailable offline.', read: 'Classic reading', readSub: 'Verse by verse, with the translation', mm: 'Mind map', mmSub: (k) => k + ' themes as mind maps', surah: (n) => 'Surah ' + n, verse: 'Verse' }
  };
  const tx = (k) => T[L()][k];
  const PER = 10;
  const AN = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const IC = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5.5l11 6.5-11 6.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor"/></svg>',
    prev: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h2.4v14H6zM19 5.5v13L9.5 12z" fill="currentColor"/></svg>',
    next: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.6 5H18v14h-2.4zM5 5.5v13l9.5-6.5z" fill="currentColor"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
    copy: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    map: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="7" y="10" width="10" height="5" rx="1.8"/><circle cx="4.5" cy="4.5" r="2"/><circle cx="19.5" cy="4.5" r="2"/><circle cx="4.5" cy="19.5" r="2"/><circle cx="19.5" cy="19.5" r="2"/><path d="M6 6l2.6 4M18 6l-2.6 4M6 18l2.6-3M18 18l-2.6-3"/></svg>',
    more: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.8" fill="currentColor"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/><circle cx="19" cy="12" r="1.8" fill="currentColor"/></svg>',
    repeat: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2l3 3-3 3"/><path d="M4 11V9a4 4 0 0 1 4-4h12"/><path d="M7 22l-3-3 3-3"/><path d="M20 13v2a4 4 0 0 1-4 4H4"/></svg>',
    head: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.6" fill="currentColor"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.6" fill="currentColor"/></svg>'
  };
  /* texte affiché : champ text_qpc_hafs de quran.com (celui que quran.com affiche avec cette police) */
  // secours si le champ manque : codage Tanzil → codage KFGQPC (soukoun = U+06E1, zéro rond = U+0652)
  const toQpc = (t) => t.replace(/\u0652/g, '\u06E1').replace(/\u06DF/g, '\u0652');
  const qpc = {};
  const loadQpc = (n) => (qpc[n] = qpc[n] || (async () => {
    const V = {};
    for (let p = 1; p < 20; p++) {
      const r = await fetch('https://api.quran.com/api/v4/verses/by_chapter/' + n + '?words=true&word_fields=text_qpc_hafs,text_uthmani&per_page=50&page=' + p);
      if (!r.ok) throw new Error(r.status);
      const j = await r.json();
      j.verses.forEach((v) => { V[v.verse_number] = v.words.filter((w) => w.char_type_name === 'word').map((w) => ({ q: w.text_qpc_hafs || toQpc(w.text_uthmani || ''), u: w.text_uthmani || w.text_qpc_hafs })); });
      if (!j.pagination || !j.pagination.next_page) break;
    }
    return V;
  })().catch((e) => { delete qpc[n]; throw e; }));
  let bismSvg = null;
  const bism = () => (bismSvg = bismSvg || fetch('img/bismillah.svg').then((r) => r.text()).catch(() => ''));

  /* ---------- lecteur : un seul élément audio réutilisé (fiable sur iPhone) ---------- */
  const P = { a: null, n: 0, ay: 0, total: 0, mode: 'off', on: null, rep: false };
  const audioEl = () => (P.a = P.a || new Audio());
  const pStop = () => { if (P.a) { P.a.pause(); P.a.onended = P.a.onerror = null; } P.mode = 'off'; P.rep = false; P.on && P.on(); };
  const pPlay = (ay, mode) => {
    if (W.stopQuran) W.stopQuran();
    document.querySelectorAll('.lc-w.on,.lc-v.sel').forEach((x) => x.classList.remove('on', 'sel'));
    const a = audioEl(); P.ay = ay; P.mode = mode;
    a.onended = () => {
      if (P.rep) return pPlay(P.ay, P.mode);
      if (P.mode === 'surah' && P.ay < P.total) pPlay(P.ay + 1, 'surah'); else pStop();
    };
    a.onerror = () => { pStop(); };
    a.src = W.verseAudio(P.n, ay);
    a.play().catch(() => pStop());
    P.on && P.on();
  };
  window.addEventListener('hashchange', () => { if (P.mode !== 'off') pStop(); document.querySelectorAll('.lc-fab').forEach((x) => x.remove()); });

  /* ---------- petite fenêtre du bas (menu ⋯) ---------- */
  const sheet = (items, title) => {
    const close = () => { scrim.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const box = h('div.lc-sheet', { role: 'dialog', 'aria-modal': 'true' }, h('span.lc-grab'), title ? h('div.lc-sh-t', null, title) : null,
      items.map(([ic, label, fn]) => h('button.lc-sh-i', { on: { click: () => { close(); fn(); } } }, h('span', { html: IC[ic] }), label)));
    const scrim = h('div.lc-scrim', { on: { click: (e) => { if (e.target === scrim) close(); } } }, box);
    document.body.append(scrim); document.addEventListener('keydown', onKey, true);
    return close;
  };

  const copyVerse = (txt) => {
    const ok = () => W.toast(tx('copied'));
    try { navigator.clipboard.writeText(txt).then(ok, ok); } catch (e) { ok(); }
  };

  /* ---------- la page ---------- */
  W.renderReading = (n, info, gloss, startAy) => {
    const [num, name, trFr, trEn, place, total] = info;
    P.n = n; P.total = total; pStop();
    const pages = Math.ceil(total / PER);
    const key = 'wakf.lc.page.' + n;
    let page = 0;
    try { page = Math.min(pages - 1, Math.max(0, +(localStorage.getItem(key) || 0))); } catch (e) {}
    if (startAy) page = Math.floor((startAy - 1) / PER);
    let V = null, TR = null, trFail = false;

    const root = h('div.lc');
    const head = h('div.lc-ch', null,
      h('span.sn.lc-sn', { 'aria-label': name, translate: 'no' }, String(n).padStart(3, '0')),
      h('div.lc-nm', null, [name, L() === 'en' ? trEn : trFr, place === 'Md' ? (L() === 'en' ? 'Medinan' : 'Médinoise') : (L() === 'en' ? 'Meccan' : 'Mecquoise')].filter((v, i, a) => v && !(i === 1 && v === name)).join(' · ')));
    const bis = h('div.lc-bism', { 'aria-label': 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ' });
    if (n !== 1 && n !== 9) bism().then((s) => { bis.innerHTML = s; });
    const list = h('div.lc-list');
    const pager = h('div.lc-pg');
    root.append(head, list, pager);

    const verseEls = {};
    const mark = () => {
      Object.entries(verseEls).forEach(([a, el]) => el.classList.toggle('now', P.mode !== 'off' && +a === P.ay));
    };
    const verseEl = (a) => {
      const ws = V[a] || [];
      const g = (gloss && gloss[a]) || {};
      const arEl = h('div.lc-ar', { lang: 'ar', dir: 'rtl' });
      ws.forEach((w, i) => {
        const b = h('button.lc-w', { lang: 'ar' }, w.q);
        b.addEventListener('click', (e) => {
          e.stopPropagation();
          if (P.mode !== 'off') pStop();
          document.querySelectorAll('.lc-w.on').forEach((x) => x.classList.remove('on'));
          document.querySelectorAll('.lc-v.sel').forEach((x) => x.classList.remove('sel'));
          b.classList.add('on'); el.classList.add('sel');
          const m = g[i + 1];
          if (m && (m[L()] || m.en)) W.mmShowMeaning(b, { ar: w.u, fr: m.fr, en: m.en });
          else W.mmHideMeaning && W.mmHideMeaning();
          W.playUrls([W.wordAudio(n, a, i + 1)], { el: b, fallback: () => {} });
        });
        if (i < ws.length - 1) arEl.append(b, ' ');
        else arEl.append(h('span.lc-nw', null, b, ' ', h('span.lc-end', { 'aria-label': tx('verse') + ' ' + a }, AN(a))));
      });
      if (!ws.length) arEl.append(h('span.lc-end', null, AN(a)));
      const trEl = h('div.lc-tr', null, TR ? TR[a - 1] || '' : trFail ? '' : h('span.lc-sk'));
      const playB = h('button.lc-act', { 'aria-label': tx('listenV'), html: IC.play, on: { click: () => (P.mode !== 'off' && P.ay === a ? pStop() : pPlay(a, 'one')) } });
      const el = h('div.lc-v', { id: 'v' + a },
        h('div.lc-hd', null, h('span.lc-key', null, name + ' : ' + a), h('span.lc-acts', null,
          playB,
          h('button.lc-act', { 'aria-label': tx('copy'), html: IC.copy, on: { click: () => copyVerse(ws.map((w) => w.u).join(' ') + ' ﴿' + AN(a) + '﴾') } }),
          h('button.lc-act', { 'aria-label': tx('map'), html: IC.map, on: { click: () => goMap(a) } }),
          h('button.lc-act', { 'aria-label': tx('more'), html: IC.more, on: { click: () => sheet([
            ['play', tx('listenV'), () => pPlay(a, 'one')],
            ['repeat', tx('repeat'), () => { pPlay(a, 'one'); P.rep = true; }],
            ['map', tx('map'), () => goMap(a)],
            ['copy', tx('copy'), () => copyVerse(ws.map((w) => w.u).join(' ') + ' ﴿' + AN(a) + '﴾')]
          ], name + ' : ' + a) } }))),
        arEl, trEl);
      el._tr = trEl; el._play = playB;
      return el;
    };
    const goMap = (a) => { try { sessionStorage.setItem('wakf.mm2.goto', String(a)); } catch (e) {} location.hash = '#/mm/' + n; };

    const draw = (scroll) => {
      for (const k in verseEls) delete verseEls[k];
      const a0 = page * PER + 1, a1 = Math.min(total, a0 + PER - 1);
      const kids = [];
      if (page === 0 && n !== 1 && n !== 9) kids.push(bis);
      for (let a = a0; a <= a1; a++) kids.push((verseEls[a] = verseEl(a)));
      list.replaceChildren(...kids);
      pager.replaceChildren(
        h('button.lc-pb', { disabled: page === 0, on: { click: () => go(page - 1) } }, '‹ ' + tx('prev')),
        h('span.lc-pn', null, (page + 1) + ' / ' + pages),
        h('button.lc-pb.pr', { disabled: page >= pages - 1, on: { click: () => go(page + 1) } }, tx('next') + ' ›'));
      pager.hidden = pages < 2;
      try { localStorage.setItem(key, String(page)); } catch (e) {}
      mark();
      if (scroll === 'top') window.scrollTo({ top: 0 });
      else if (scroll) { const el = verseEls[scroll]; if (el) el.scrollIntoView({ block: 'center' }); }
    };
    const go = (p) => { page = Math.max(0, Math.min(pages - 1, p)); draw('top'); };

    /* bouton rond d'écoute → mini-lecteur */
    const fab = h('div.lc-fab');
    const renderFab = () => {
      if (P.mode === 'off') {
        fab.className = 'lc-fab';
        fab.replaceChildren(h('button.lc-fab-b', { 'aria-label': tx('listen'), html: IC.head, on: { click: () => pPlay(page * PER + 1, 'surah') } }));
      } else {
        fab.className = 'lc-fab open';
        const paused = P.a && P.a.paused;
        fab.replaceChildren(
          h('button.lc-pp', { 'aria-label': paused ? tx('play') : tx('pause'), html: paused ? IC.play : IC.pause, on: { click: () => { if (P.a.paused) P.a.play().catch(() => {}); else P.a.pause(); renderFab(); } } }),
          h('span.lc-fi', null, h('b', null, name + ' : ' + P.ay), h('small', null, 'Mishary Alafasy')),
          h('button.lc-fx', { 'aria-label': tx('prev'), html: IC.prev, on: { click: () => P.ay > 1 && pPlay(P.ay - 1, P.mode === 'one' ? 'surah' : P.mode) } }),
          h('button.lc-fx', { 'aria-label': tx('next'), html: IC.next, on: { click: () => P.ay < total && pPlay(P.ay + 1, P.mode === 'one' ? 'surah' : P.mode) } }),
          h('button.lc-fx', { 'aria-label': tx('close'), html: IC.close, on: { click: pStop } }));
      }
    };
    P.on = () => {
      if (!root.isConnected) return;
      if (P.mode !== 'off') {
        const pg = Math.floor((P.ay - 1) / PER);
        if (pg !== page) { page = pg; draw(P.ay); }
        mark();
        const el = verseEls[P.ay];
        if (el) { const r = el.getBoundingClientRect(); if (r.top < 70 || r.bottom > innerHeight - 140) el.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      } else mark();
      Object.entries(verseEls).forEach(([a, el]) => { el._play.innerHTML = P.mode !== 'off' && +a === P.ay ? IC.pause : IC.play; });
      renderFab();
    };
    renderFab();
    root._attach = () => { document.querySelectorAll('.lc-fab').forEach((x) => x.remove()); document.body.append(fab); };

    list.append(h('div.lc-load', null, h('span.lc-sk'), h('span.lc-sk'), h('span.lc-sk.s')));
    root._ready = loadQpc(n).then((v) => { V = v; draw(startAy || false); }).catch(() => { root._fail = true; });
    W.qcTr(n, L() === 'en' ? 20 : 31).then((l) => { TR = l; Object.entries(verseEls).forEach(([a, el]) => { el._tr.textContent = l[a - 1] || ''; }); })
      .catch(() => { trFail = true; Object.values(verseEls).forEach((el) => { el._tr.textContent = tx('trErr'); el._tr.classList.add('err'); }); });
    return root;
  };

  /* ---------- fenêtre S4 : Lecture classique / Mind map ---------- */
  const star = (cx, cy, R, fill) => { let d = ''; for (let k = 0; k < 16; k++) { const a = ((-90 + k * 22.5) * Math.PI) / 180, r = k % 2 ? R * 0.7654 : R; d += (k ? 'L' : 'M') + (cx + r * Math.cos(a)).toFixed(2) + ' ' + (cy + r * Math.sin(a)).toFixed(2); } return '<path fill="' + fill + '" stroke="' + fill + '" stroke-width="2" stroke-linejoin="round" d="' + d + 'z"/>'; };
  const LD = '#2B54AC', LA = '#3E6FD8', SA = '#F0A830';
  const ART_READ = '<svg viewBox="0 0 160 160" aria-hidden="true"><path d="M44 132l72-46M116 132L44 86" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".55"/><path d="M80 62c-14-9-32-11-50-8v52c18-3 36-1 50 8z" fill="#fff"/><path d="M80 62c14-9 32-11 50-8v52c-18-3-36-1-50 8z" fill="#fff"/><path d="M80 62v52" stroke="' + LD + '" stroke-width="4" stroke-linecap="round"/><path d="M42 70c10-1.5 20-.5 28 3M42 81c10-1.5 20-.5 28 3M42 92c10-1.5 20-.5 26 2.5" stroke="' + LD + '" stroke-width="4.5" stroke-linecap="round" opacity=".55" fill="none"/><path d="M118 70c-10-1.5-20-.5-28 3M118 81c-10-1.5-20-.5-28 3M118 92c-10-1.5-20-.5-26 2.5" stroke="' + LD + '" stroke-width="4.5" stroke-linecap="round" opacity=".55" fill="none"/><circle cx="80" cy="34" r="17" fill="' + SA + '"/>' + star(80, 34, 9, '#fff') + '<circle cx="36" cy="30" r="4" fill="#fff" opacity=".5"/><circle cx="126" cy="26" r="4" fill="#fff" opacity=".5"/></svg>';
  const ART_MAP = '<svg viewBox="0 0 160 160" aria-hidden="true"><g stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".55" fill="none"><path d="M80 80L34 38M80 80l46-42M80 80l-46 44M80 80l46 44"/></g><rect x="48" y="60" width="64" height="40" rx="12" fill="#fff"/><path d="M60 74h40M66 86h28" stroke="' + LD + '" stroke-width="5" stroke-linecap="round"/><circle cx="34" cy="38" r="15" fill="#fff"/><circle cx="34" cy="38" r="6" fill="' + LA + '" opacity=".35"/><circle cx="34" cy="124" r="15" fill="#fff"/><path d="M27 124h14" stroke="' + LA + '" stroke-width="4" stroke-linecap="round" opacity=".5"/><circle cx="126" cy="124" r="15" fill="#fff"/><circle cx="126" cy="124" r="6" fill="' + LA + '" opacity=".35"/><circle cx="126" cy="38" r="17" fill="' + SA + '"/>' + star(126, 38, 9, '#fff') + '</svg>';
  W.openSurahSheet = (info) => {
    const [n, name, , , , , , themes] = info;
    const close = () => { scrim.classList.add('out'); setTimeout(() => scrim.remove(), 180); document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const btn = (href, art, title, sub) => h('a.lc-mb', { href, on: { click: () => { scrim.remove(); document.removeEventListener('keydown', onKey, true); } } },
      h('span.lc-art', { html: art }), h('span.lc-mt', null, h('b', null, title), h('small', null, sub)), h('span.lc-go', null, '›'));
    const box = h('div.lc-sheet.s4', { role: 'dialog', 'aria-modal': 'true', 'aria-label': name },
      h('span.lc-grab'),
      h('div.lc-band', null, h('small', null, tx('surah')(n)), h('span.sn', { translate: 'no', 'aria-hidden': 'true' }, String(n).padStart(3, '0')), h('b', null, name)),
      btn('#/lc/' + n, ART_READ, tx('read'), tx('readSub')),
      btn('#/mm/' + n, ART_MAP, tx('mm'), tx('mmSub')(themes)));
    const scrim = h('div.lc-scrim', { on: { click: (e) => { if (e.target === scrim) close(); } } }, box);
    document.body.append(scrim); document.addEventListener('keydown', onKey, true);
    const first = box.querySelector('a'); if (first) first.focus({ preventScroll: true });
  };
})();
