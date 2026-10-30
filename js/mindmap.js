/* Wakf — Surah mind maps · design A2 « Rubriques colorées »
   Remplace l'ancien js/mindmap.js. Même API : W.renderMindmap(data).
   Les données (data/rahman.json) ne changent pas. Styles : css/mindmap-a2.css (classes .mm2-*). */
(function () {
  'use strict';
  const { h, t, ar } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const tt = (o, k) => (o ? o[k + '_' + L()] || o[k + '_en'] || o[k + '_fr'] || '' : '');
  const TXT = {
    fr: { verse: 'Verset', verses: 'Versets', themes: 'Les thèmes', listen: 'Écouter et mémoriser', trLink: 'Traduction Hamidullah sur quran.com', themesN: (n, v) => n + ' thèmes ' + (v ? 'visuels' : 'mentaux'), heard: 'écoutés' },
    en: { verse: 'Verse', verses: 'Verses', themes: 'Themes', listen: 'Listen & memorise', trLink: 'Translation on quran.com', themesN: (n, v) => n + (v ? ' visual' : ' mental') + ' themes', heard: 'heard' }
  };
  const tx = (k) => TXT[L()][k];

  /* Couleur de chaque thème (variables déjà définies dans app.css : --jade, --lapis…) */
  const BY_ID = {
    'mercy-creation': 'amethyste', 'mercy-heavens': 'lapis', 'mercy-balance': 'safran', 'mercy-earth': 'jade',
    'majesty-creation': 'amethyste', 'mercy-seas': 'lapis', center: 'safran',
    mercy: 'amethyste', accountability: 'lapis', challenge: 'safran', 'judgment-day': 'amethyste',
    punishment: 'grenade', reward: 'jade', 'the-foremost': 'jade', 'who-follow-after': 'jade'
  };
  const CYCLE = ['amethyste', 'lapis', 'safran', 'jade'];

  /* ---------- progression : versets écoutés (stockage local) ---------- */
  let surahN = 0, CUR = null;
  const heardKey = () => 'wakf.mm2.heard.' + surahN;
  const getHeard = () => { try { return new Set(JSON.parse(localStorage.getItem(heardKey()) || '[]')); } catch (e) { return new Set(); } };
  const markHeard = (ayah) => {
    if (!ayah) return;
    const s = getHeard(); if (s.has(ayah)) return; s.add(ayah);
    try { localStorage.setItem(heardKey(), JSON.stringify([...s])); } catch (e) {}
    document.querySelectorAll('[data-mm2-ayat]').forEach(refreshBar);
  };
  const refreshBar = (el) => {
    const ay = (el.dataset.mm2Ayat || '').split(',').filter(Boolean).map(Number);
    const hs = getHeard(); const n = ay.filter((a) => hs.has(a)).length;
    const pct = ay.length ? Math.round((100 * n) / ay.length) : 0;
    const bar = el.querySelector('.mm2-bar'); if (bar) bar.style.width = pct + '%';
    const lab = el.querySelector('.mm2-heard'); if (lab) lab.textContent = !n ? '' : el.classList.contains('mm2-top') ? Math.max(1, pct) + ' % ' + tx('heard') : n + ' / ' + ay.length + ' ' + tx('heard');
  };

  /* ---------- helpers données ---------- */
  const walk = (nodes, fn) => (nodes || []).forEach((n) => { fn(n); walk(n.children, fn); });
  const ayatOf = (s, S) => {
    const a = []; walk(s.nodes, (n) => n.ayah && a.push(n.ayah));
    (s.subsections || []).forEach((id) => S[id] && a.push(...ayatOf(S[id], S)));
    return [...new Set(a)].sort((x, y) => x - y);
  };
  const firstArt = (s, S) => {
    let art = null; walk(s.nodes, (n) => { if (!art && n.art && W.MMART[n.art]) art = n.art; });
    (s.subsections || []).forEach((id) => { if (!art && S[id]) art = firstArt(S[id], S); });
    return art;
  };
  const rangeTxt = (a) => {
    if (!a.length) return '';
    if (a.length === 1) return tx('verse') + ' ' + a[0];
    return tx('verses') + ' ' + a[0] + ' – ' + a[a.length - 1];
  };
  const audioKey = (ayah) => (W.mmKey && ayah ? W.mmKey + '-' + String(ayah).padStart(3, '0') : null);

  /* ---------- éléments ---------- */
  const wordEl = (w, opt) => {
    const b = h('button.w' + (opt && opt.hl ? '.hl' : ''), { lang: 'ar' }, ar(w.ar), h('span.gl', null, w[L()] || w.en || ''));
    b.addEventListener('click', (e) => {
      e.stopPropagation();
      document.querySelectorAll('.w.on').forEach((x) => x.classList.remove('on'));
      b.classList.add('on'); W.say(w.ar, null);
      if (opt && opt.ayah) markHeard(opt.ayah);
    });
    return b;
  };
  const sayEl = (words, ayah) => {
    const b = W.sayBtn(() => words.map((w) => w.ar).join(' '), audioKey(ayah), 'mm2-say');
    b.addEventListener('click', () => markHeard(ayah));
    return b;
  };
  const badge = (ayah) => h('span.mm2-n', { title: tx('verse') + ' ' + ayah }, String(ayah));

  const refrainEl = (R, ayah) => {
    const row = h('div.mm2-refrain', { dir: 'rtl', title: R[L()] || R.en });
    if (ayah) row.append(badge(ayah));
    R.words.forEach((w) => row.append(wordEl(w, { ayah })));
    row.append(sayEl(R.words, ayah));
    return row;
  };

  /* La « carte » d'un nœud (sans ses enfants) */
  const boxEl = (n, effect) => {
    const hlAll = n.highlight === true; const hl = new Set(Array.isArray(n.highlight) ? n.highlight : []);
    const box = h('div.mm2-box' + (effect ? '.fx' : '') + (n.boxed ? '.boxed' : ''));
    if (n.art && W.MMART[n.art]) box.append(h('span.mm2-art', { html: W.MMART[n.art] }));
    if (n.ayah || n.refrain_marker) {
      const meta = h('div.mm2-meta');
      if (n.ayah) meta.append(badge(n.ayah));
      if (n.refrain_marker) meta.append(h('span.mm-ref', { title: t('refrainHint'), html: W.svg('refrain') }));
      box.append(meta);
    }
    if (n.words && n.words.length) {
      box.append(h('div.mm2-words', { dir: 'rtl' }, n.words.map((w, i) => wordEl(w, { hl: hlAll || w.highlight || hl.has(i) || hl.has(w.ar), ayah: n.ayah }))));
      if (n.ayah) box.append(sayEl(n.words, n.ayah));
    }
    const nt = n['note_' + L()] || n.note_en;
    if (nt) box.append(h('div.mm2-note', null, nt));
    return box;
  };

  const ARROW = '<svg viewBox="0 0 22 14" aria-hidden="true"><path d="M21 7H2M8 1L2 7l6 6" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const connector = (k) => {
    let d = 'M50 0V10';
    if (k > 1) {
      const xs = Array.from({ length: k }, (_, i) => ((2 * i + 1) * 50) / k);
      d += 'M' + xs[0] + ' 10H' + xs[k - 1] + xs.map((x) => 'M' + x + ' 10V22').join('');
    } else d += 'V22';
    return h('div.mm2-link', { html: '<svg viewBox="0 0 100 22" preserveAspectRatio="none" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="2.5" vector-effect="non-scaling-stroke"/></svg>' });
  };

  /* d = profondeur : au 1er niveau les branches s'étalent en colonnes,
     plus bas (colonnes étroites) elles s'empilent pour rester lisibles sur mobile */
  const kidsEl = (kids, R, d) => {
    const k = kids.length;
    const cols = d > 0 ? 1 : (k <= 3 ? k : 2);
    const wrap = h('div.mm2-branch');
    wrap.append(connector(d > 0 ? 1 : Math.min(k, 3)));
    wrap.append(h('div.mm2-kids', { dir: 'rtl', style: { gridTemplateColumns: 'repeat(' + cols + ', minmax(0, 1fr))' } }, kids.map((c) => nodeEl(c, R, d + 1))));
    return wrap;
  };

  const nodeEl = (n, R, d) => {
    d = d || 0;
    if (n.is_refrain) return refrainEl(R, n.ayah);
    const kids = n.children || [];
    const hasOwn = (n.words && n.words.length) || n.art;
    if (!hasOwn && kids.length) {
      // groupe (ex. « Les Jardins ») : étiquette + enfants
      const g = h('div.mm2-group');
      const lab = n['label_' + L()] || n.label_en;
      if (lab) g.append(h('div.mm2-label', null, lab));
      g.append(h('div.mm2-kids.stack', null, kids.map((c) => nodeEl(c, R, d))));
      return g;
    }
    // un seul enfant terminal : « cause → conséquence » sur une ligne
    if (kids.length === 1 && !(kids[0].children || []).length && !kids[0].is_refrain) {
      return h('div.mm2-pair' + (d > 0 ? '.v' : ''), { dir: 'rtl' }, boxEl(n), h('span.mm2-arrow', { html: ARROW }), boxEl(kids[0], true));
    }
    if (kids.length) return h('div.mm2-tree', null, boxEl(n), kidsEl(kids, R, d));
    return boxEl(n);
  };

  /* ---------- une section = une « rubrique » ---------- */
  const openKey = 'wakf.mm2.open';
  const getOpen = () => { try { return new Set(JSON.parse(sessionStorage.getItem(openKey) || '[]')); } catch (e) { return new Set(); } };
  const setOpen = (id, on) => { const s = getOpen(); on ? s.add(id) : s.delete(id); try { sessionStorage.setItem(openKey, JSON.stringify([...s])); } catch (e) {} };

  const sectionEl = (s, R, S, idx, opts) => {
    const col = BY_ID[s.id] || CYCLE[idx % CYCLE.length];
    const ayat = ayatOf(s, S);
    const sec = h('section.mm2-sec.c-' + col + (opts.sub ? '.sub' : ''), { id: 'mm-' + s.id, 'data-mm2-ayat': ayat.join(',') });
    const title = tt(s, 'title');
    const art = firstArt(s, S);
    const isOpen = opts.sub || opts.open;
    if (isOpen) sec.classList.add('open');

    const head = h('button.mm2-head', { 'aria-expanded': String(!!isOpen) },
      h('span.mm2-panel', null, art ? h('span.mm2-panel-art', { html: W.MMART[art] }) : h('span.ar', { lang: 'ar' }, s.center_ar || '')),
      h('span.mm2-info', null,
        title ? h('b', null, title, s.marker ? h('span.ar.mm2-marker', { lang: 'ar' }, s.marker) : null) : h('b.ar', { lang: 'ar' }, s.center_ar || ''),
        h('small', null, rangeTxt(ayat), h('span.mm2-heard')),
        h('span.mm2-track', null, h('span.mm2-bar'))),
      opts.sub ? null : h('span.mm2-chev', { html: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' }));
    if (!opts.sub) head.addEventListener('click', () => {
      const on = !sec.classList.contains('open');
      sec.classList.toggle('open', on); head.setAttribute('aria-expanded', String(on)); setOpen(s.id, on);
    });

    const body = h('div.mm2-body');
    if (s.center_ar && title) body.append(h('div.mm-center', { lang: 'ar' }, s.center_ar));
    s.nodes.forEach((n) => body.append(nodeEl(n, R)));
    (s.subsections || []).forEach((id, i) => S[id] && body.append(sectionEl(S[id], R, S, idx + i + 1, { sub: true })));
    if (!opts.sub && ayat.length) {
      const first = []; walk(s.nodes, (n) => { if (!first.length && n.ayah && n.words && n.words.length) first.push(n); });
      if (first.length) {
        const play = h('button.btn.block.mm2-play', null, h('span', { html: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>' }), tx('listen'));
        play.addEventListener('click', () => {
          const k = audioKey(first[0].ayah); W.say(first[0].words.map((w) => w.ar).join(' '), k); markHeard(first[0].ayah);
        });
        body.append(play);
      }
      const trId = CUR && CUR.translation && CUR.translation[L()];
      if (trId) {
        const rng = ayat.length > 1 ? ayat[0] + '-' + ayat[ayat.length - 1] : String(ayat[0]);
        body.append(h('a.btn.outline.block.mm2-tr', { href: 'https://quran.com/' + surahN + '/' + rng + '?translations=' + trId, target: '_blank', rel: 'noopener' },
          h('span', { html: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5C6.5 4 9.5 4 12 6c2.5-2 5.5-2 8-.5V19c-2.5-1.5-5.5-1.5-8 .5-2.5-2-5.5-2-8-.5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M12 6v13.5" stroke="currentColor" stroke-width="2"/></svg>' }), tx('trLink')));
      }
    }
    sec.append(head, body);
    refreshBar(sec);
    return sec;
  };

  /* ---------- page ---------- */
  const splitName = (full) => { const m = /^(.*?)\s*\((.*)\)\s*$/.exec(full || ''); return m ? [m[1], m[2]] : [full || '', '']; };
  const allAyat = (secs, S) => [...new Set(secs.flatMap((s) => ayatOf(s, S)))].sort((x, y) => x - y);

  const headerEl = (data, R, secs, S) => {
    const ay = allAyat(secs, S);
    const total = data.surah.verses || (ay.length ? ay[ay.length - 1] : 0);
    const [main] = splitName(data.surah['name_' + L()] || data.surah.name_en);
    const top = h('section.mm2-top.c-lapis', { 'data-mm2-ayat': ay.join(',') },
      h('div.mm2-top-panel', null,
        h('span.mm2-top-n', null, t('surahN', { n: data.surah.number })),
        h('span.ar', { lang: 'ar' }, data.surah.name_ar)),
      h('div.mm2-top-info', null,
        h('h1', null, main),
        h('div.mm2-chips', null,
          total ? h('span', null, total + ' ' + tx('verses').toLowerCase()) : null,
          h('span', null, secs.length + ' ' + tx('themes').replace(/^Les /, '').toLowerCase()))));
    return top;
  };

  /* Tous les thèmes de la sourate, dans l'ordre des versets, sans séparation en onglets */
  W.renderMindmap = (data) => {
    surahN = data.surah.number; CUR = data;
    W.mmKey = 'sourates/' + String(data.surah.number).padStart(3, '0');
    const R = data.refrain; const S = {}; data.sections.forEach((s) => (S[s.id] = s));
    const first = (s) => { const a = ayatOf(s, S); return a.length ? a[0] : 1e9; };
    const secs = data.sections.filter((s) => !s.parent).map((s, i) => [first(s), i, s]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((x) => x[2]);
    const root = h('div.mm2');
    root.append(headerEl(data, R, secs, S));
    root.append(h('h2.mm2-h2', null, tx('themes')));
    const grid = h('div.mm2-grid');
    const opened = getOpen();
    secs.forEach((s, i) => grid.append(sectionEl(s, R || { words: [] }, S, i, { open: i === 0 || opened.has(s.id) })));
    root.append(grid);
    return root;
  };
})();
