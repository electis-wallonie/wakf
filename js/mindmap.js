/* Wakf — Surah mind maps, re-drawn from structured data (no images of the original map) */
(function () {
  'use strict';
  const { h, t, ar } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const tt = (o, k) => (o ? o[k + '_' + L()] || o[k + '_en'] || o[k + '_fr'] || '' : '');

  const wordEl = (w, opt) => {
    const b = h('button.w' + (opt && opt.hl ? '.hl' : ''), { lang: 'ar' }, ar(w.ar), h('span.gl', null, w[L()] || w.en || ''));
    b.addEventListener('click', (e) => { e.stopPropagation(); document.querySelectorAll('.w.on').forEach((x) => x.classList.remove('on')); b.classList.add('on'); W.say(w.ar, null); });
    return b;
  };
  const refrainEl = (R, mini) => h('div.refrain' + (mini ? '.mini' : ''), { dir: 'rtl', title: R[L()] || R.en }, R.words.map((w) => wordEl(w)));

  const nodeEl = (n, R) => {
    if (n.is_refrain) return h('div.mm-node', null, refrainEl(R, true));
    const wrap = h('div.mm-node');
    const hlAll = n.highlight === true; const hl = new Set(Array.isArray(n.highlight) ? n.highlight : []);
    if (n.words && n.words.length) {
      const row = h('div.mm-row' + (n.boxed ? '.boxed' : ''), { dir: 'rtl' });
      if (n.ayah) row.append(h('span.mm-n', { title: (W.lang === 'en' ? 'Verse ' : 'Verset ') + n.ayah }, String(n.ayah)));
      n.words.forEach((w, i) => row.append(wordEl(w, { hl: hlAll || hl.has(i) || hl.has(w.ar) })));
      if (n.art && W.MMART[n.art]) row.append(h('span.mm-img', { html: W.MMART[n.art] }));
      if (n.refrain_marker) row.append(h('span.mm-ref', { title: t('refrainHint'), html: W.svg('refrain') }));
      const say = W.sayBtn(() => n.words.map((w) => w.ar).join(' '), W.mmKey && n.ayah ? W.mmKey + '-' + String(n.ayah).padStart(3, '0') : null, 'mm-speak');
      row.append(say);
      wrap.append(row);
    }
    if (n.art && W.MMART[n.art] && !(n.words && n.words.length)) wrap.prepend(h('span.mm-img', { html: W.MMART[n.art] }));
    if (n.label_en || n.label_fr) wrap.prepend(h('span.mm-label', null, '— ' + (n['label_' + L()] || n.label_en) + ' —'));
    const nt = n['note_' + L()] || n.note_en; if (nt && !n.words?.length) wrap.append(h('div.small.muted', { style: { margin: '2px 8px' } }, nt));
    if (n.children && n.children.length) wrap.append(h('div.mm-kids', null, n.children.map((c) => nodeEl(c, R))));
    return wrap;
  };

  const sectionEl = (s, R, S) => {
    const sec = h('section.mm-sec', { id: 'mm-' + s.id });
    const title = tt(s, 'title');
    if (title) sec.append(h('div.mm-pill', null, title, s.marker ? ar(s.marker) : null));
    if (s.center_ar) sec.append(h('div.mm-center', { lang: 'ar' }, s.center_ar));
    s.nodes.forEach((n) => sec.append(nodeEl(n, R)));
    (s.subsections || []).forEach((id) => S[id] && sec.append(sectionEl(S[id], R, S)));
    if (s.subsections) sec.classList.add('full');
    return sec;
  };

  W.renderMindmap = (data, tab) => {
    W.mmKey = 'sourates/' + String(data.surah.number).padStart(3, '0');
    if (data.layout === 'single') {
      const root = h('div');
      root.append(h('div.mm-hero', null, h('div.small', { style: { textTransform: 'uppercase', letterSpacing: '.8px' } }, t('surahN', { n: data.surah.number })),
        h('div.ar', { lang: 'ar' }, data.surah.name_ar), h('div', null, data.surah['name_' + L()] || data.surah.name_en)));
      const grid = h('div.mm-grid');
      data.sections.forEach((s) => { const el = sectionEl(s, null, {}); if (!s.title_en) el.classList.add('notitle'); grid.append(el); });
      root.append(grid);
      return root;
    }
    const R = data.refrain; const S = {}; data.sections.forEach((s) => (S[s.id] = s));
    const root = h('div');
    root.append(h('div.mm-hero', null, h('div.small', { style: { textTransform: 'uppercase', letterSpacing: '.8px' } }, t('surahN', { n: data.surah.number })),
      h('div.ar', { lang: 'ar' }, data.surah.name_ar), h('div', null, data.surah['name_' + L()] || data.surah.name_en),
      h('div', { style: { marginTop: '10px' } }, h('div.small', null, t('refrain')), refrainEl(R)), h('div.small', null, R[L()] || R.en)));
    const seg = h('div.seg', { 'data-i': tab === 'mental' ? 1 : 0, role: 'tablist' }, h('span.thumb'),
      h('button' + (tab !== 'mental' ? '.on' : ''), { role: 'tab', on: { click: () => switchTab('visual') } }, h('span', { html: W.svg('eye') }), t('mmVisual')),
      h('button' + (tab === 'mental' ? '.on' : ''), { role: 'tab', on: { click: () => switchTab('mental') } }, h('span', { html: W.svg('brain') }), t('mmMental')));
    const pane = h('div.tabpane');
    root.append(seg, pane);
    const draw = (which) => {
      const info = which === 'mental' ? data.mental_links : data.visual_links;
      const head = h('div.card.mm-intro', null, h('span.ar', { lang: 'ar' }, info.name_ar), h('div', null, h('h3', null, tt(info, 'title')), h('p', null, tt(info, 'text'))));
      const kids = [head];
      if (which === 'mental' && info.flow) {
        const flow = h('div.flow');
        info.flow.forEach((f, i) => {
          if (i) flow.append(h('span.arr', null, '→'));
          flow.append(h('button', { on: { click: () => { const el = document.getElementById('mm-' + f.id); el && el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } } }, tt(f, 'title'), h('small', null, tt(f, 'ayat'))));
        });
        kids.push(flow);
      }
      const grid = h('div.mm-grid');
      const secs = data.sections.filter((s) => s.group === which && !s.parent);
      if (which === 'mental' && info.flow) { const order = info.flow.map((f) => f.id); const ix = (id) => { const i = order.indexOf(id); return i < 0 ? 99 : i; }; secs.sort((a, b) => ix(a.id) - ix(b.id)); }
      secs.forEach((s) => grid.append(sectionEl(s, R, S)));
      kids.push(grid);
      if (info.illustration_en || info.illustration_fr) kids.push(h('p.foot-note', null, info['illustration_' + L()] || ''));
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
