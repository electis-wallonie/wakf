/* Wakf — Surah mind maps · design A2 « Rubriques colorées »
   Remplace l'ancien js/mindmap.js. Même API : W.renderMindmap(data, tab).
   Les données (data/rahman.json) ne changent pas. Styles : css/mindmap-a2.css (classes .mm2-*). */
(function () {
  'use strict';
  const { h, t, ar } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const tt = (o, k) => (o ? o[k + '_' + L()] || o[k + '_en'] || o[k + '_fr'] || '' : '');
  const TXT = {
    fr: { verse: 'Verset', verses: 'Versets', themes: 'Les thèmes', listen: 'Écouter et mémoriser', themesN: (n, v) => n + ' thèmes ' + (v ? 'visuels' : 'mentaux'), heard: 'écoutés' },
    en: { verse: 'Verse', verses: 'Verses', themes: 'Themes', listen: 'Listen & memorise', themesN: (n, v) => n + (v ? ' visual' : ' mental') + ' themes', heard: 'heard' }
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
  let surahN = 0;
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
    const lab = el.querySelector('.mm2-heard'); if (lab) lab.textContent = n ? n + ' / ' + ay.length + ' ' + tx('heard') : '';
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
    }
    sec.append(head, body);
    refreshBar(sec);
    return sec;
  };

  /* ---------- page ---------- */
  W.renderMindmap = (data, tab) => {
    surahN = data.surah.number;
    W.mmKey = 'sourates/' + String(data.surah.number).padStart(3, '0');
    const R = data.refrain; const S = {}; data.sections.forEach((s) => (S[s.id] = s));
    const root = h('div.mm2');

    if (data.layout === 'single' || !R) {
      root.append(h('div.mm-hero', null, h('div.small', { style: { textTransform: 'uppercase', letterSpacing: '.8px' } }, t('surahN', { n: data.surah.number })),
        h('div.ar', { lang: 'ar' }, data.surah.name_ar), h('div', null, data.surah['name_' + L()] || data.surah.name_en)));
      const grid = h('div.mm2-grid');
      const opened = getOpen();
      data.sections.forEach((s, i) => grid.append(sectionEl(s, R || { words: [] }, S, i, { open: i === 0 || opened.has(s.id) })));
      root.append(grid);
      return root;
    }

    root.append(h('div.mm-hero', null, h('div.small', { style: { textTransform: 'uppercase', letterSpacing: '.8px' } }, t('surahN', { n: data.surah.number })),
      h('div.ar', { lang: 'ar' }, data.surah.name_ar), h('div', null, data.surah['name_' + L()] || data.surah.name_en),
      h('div', { style: { marginTop: '10px' } }, h('div.small', null, t('refrain')), h('div.refrain', { dir: 'rtl' }, R.words.map((w) => wordEl(w)))), h('div.small', null, R[L()] || R.en)));

    const seg = h('div.seg', { 'data-i': tab === 'mental' ? 1 : 0, role: 'tablist' }, h('span.thumb'),
      h('button' + (tab !== 'mental' ? '.on' : ''), { role: 'tab', on: { click: () => switchTab('visual') } }, h('span', { html: W.svg('eye') }), t('mmVisual')),
      h('button' + (tab === 'mental' ? '.on' : ''), { role: 'tab', on: { click: () => switchTab('mental') } }, h('span', { html: W.svg('brain') }), t('mmMental')));
    const pane = h('div.tabpane');
    root.append(seg, pane);

    const draw = (which) => {
      const info = which === 'mental' ? data.mental_links : data.visual_links;
      let secs = data.sections.filter((s) => s.group === which && !s.parent);
      if (which === 'mental' && info.flow) {
        const order = info.flow.map((f) => f.id); const ix = (id) => { const i = order.indexOf(id); return i < 0 ? 99 : i; };
        secs = secs.slice().sort((a, b) => ix(a.id) - ix(b.id));
      }
      const intro = h('div.mm2-intro.c-' + (which === 'mental' ? 'amethyste' : 'lapis'),
        null, h('span.mm2-intro-ic', null, h('span.ar', { lang: 'ar' }, info.name_ar)),
        h('div', null, h('b', null, tx('themesN')(secs.length, which !== 'mental')), h('span', null, tt(info, 'text'))));
      const kids = [intro];
      if (which === 'mental' && info.flow) {
        const flow = h('div.flow');
        info.flow.forEach((f, i) => {
          if (i) flow.append(h('span.arr', null, '→'));
          flow.append(h('button', { on: { click: () => {
            const el = document.getElementById('mm-' + f.id);
            if (el) { el.classList.add('open'); setOpen(f.id, true); el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
          } } }, tt(f, 'title'), h('small', null, tt(f, 'ayat'))));
        });
        kids.push(flow);
      }
      kids.push(h('h2.mm2-h2', null, tx('themes')));
      const grid = h('div.mm2-grid');
      const opened = getOpen();
      secs.forEach((s, i) => grid.append(sectionEl(s, R, S, i, { open: i === 0 || opened.has(s.id) })));
      kids.push(grid);
      pane.replaceChildren(...kids);
      pane.style.animation = 'none'; void pane.offsetWidth; pane.style.animation = '';
    };
    const switchTab = (which) => {
      seg.dataset.i = which === 'mental' ? 1 : 0;
      seg.querySelectorAll('button').forEach((b, i) => b.classList.toggle('on', i === +seg.dataset.i));
      try { sessionStorage.setItem('wakf.mmtab', which); } catch (e) {}
      draw(which);
    };
    draw(tab === 'mental' ? 'mental' : 'visual');
    return root;
  };
})();
