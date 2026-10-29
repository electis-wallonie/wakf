/* Wakf — "Learn How to Read": faithful book rendering (list tab) + gamified reading (game tab) */
(function () {
  'use strict';
  const { h, t, ar, shuffle, icon } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const tx = (o, k) => (o ? o[k + '_' + L()] || o[k + '_fr'] || o[k + '_en'] || '' : '');

  /* ---------- build the ordered list of nodes from the book ---------- */
  W.readingNodes = (book) => {
    const P = book.pages; const by = {}; P.forEach((p) => (by[p.page] = p));
    const nodes = [];
    nodes.push({ id: 'rd-intro', unit: 1, kind: 'intro', pages: P.filter((p) => p.page >= 5 && p.page <= 7), label: t('readIntro'), glyph: 'أ ب' });
    P.filter((p) => p.kind === 'lesson').forEach((p) => {
      const wp = by[p.page + 1] && by[p.page + 1].kind === 'writing' ? by[p.page + 1] : null;
      nodes.push({ id: 'rd-l' + p.lesson, unit: 1, kind: 'lesson', page: p, writing: wp, label: t('lessonN', { n: p.lesson }), glyph: p.letter || 'ال' });
    });
    P.filter((p) => p.kind === 'text').forEach((p) => nodes.push({ id: 'rd-p' + p.page, unit: 2, kind: 'text', page: p, label: p.title_ar, glyph: '📖' }));
    const sur = P.filter((p) => p.kind === 'surah' || p.kind === 'adhkar');
    if (sur.length) nodes.push({ id: 'rd-surahs', unit: 3, kind: 'surahs', pages: sur, label: t('readSurahs'), glyph: '۞' });
    return nodes;
  };

  /* ---------- items (for games) ---------- */
  const toks = (b) => (b.lines || []).flat().filter(Boolean);
  const splitSentences = (s) => s.split(/(?<=[\.،؛؟!:])\s+/).map((x) => x.trim()).filter(Boolean);
  W.readingItems = (node) => {
    const out = [];
    const add = (s) => { s = String(s).trim(); if (s && !out.some((o) => o.ar === s)) out.push({ ar: s, t: '' }); };
    if (node.kind === 'lesson') node.page.blocks.forEach((b) => { if (['letters', 'syllables', 'words'].includes(b.type)) toks(b).forEach(add); });
    else if (node.kind === 'intro') { const a = node.pages.find((p) => p.kind === 'alphabet'); if (a) a.letters.forEach((l) => add(l.letter)); }
    else if (node.kind === 'text') node.page.paragraphs.forEach((p) => p.replace(/[\.،؛؟!:"«»()]/g, ' ').split(/\s+/).filter((w) => w.length > 2).forEach(add));
    else if (node.kind === 'surahs') node.pages.forEach((p) => (p.items || []).forEach((it) => (it.ayat ? it.ayat.forEach(add) : it.ar && add(it.ar))));
    return out;
  };

  /* ---------- rendering primitives ---------- */
  const tok = (s, cls) => {
    const b = h('button.tok' + (cls ? '.' + cls : ''), { lang: 'ar', dir: 'rtl' }, s);
    b.addEventListener('click', () => { document.querySelectorAll('.tok.on,.s.on').forEach((x) => x.classList.remove('on')); b.classList.add('on'); W.speak(s, 'ar'); b.dispatchEvent(new CustomEvent('heard', { bubbles: true })); });
    return b;
  };
  const noteEl = (txt) => h('div.rd-note', { dir: W.lang === 'ar' ? 'rtl' : 'ltr' }, txt);
  const tableEl = (b) => {
    const cols = b['columns_' + L()] || b.columns_fr || [];
    const rows = (L() === 'en' && b.rows_en) || b.rows || [];
    return h('div', null, b['title_' + L()] ? h('h3', { style: { margin: '2px 0 8px', fontSize: '15px' } }, b['title_' + L()]) : null,
      h('table.ftable', null, h('thead', null, h('tr', null, cols.map((c) => h('th', null, c)))),
        h('tbody', null, rows.map((r) => h('tr', null, r.map((c) => (/[؀-ۿ]/.test(c) && !/[a-z]/i.test(c) ? h('td.ar', { lang: 'ar' }, c) : h('td', null, c))))))));
  };
  W.renderBlock = (b) => {
    const label = { letters: 'b_letters', syllables: 'b_syllables', words: 'b_words', sentences: 'b_sentences', forms: 'b_forms', note: 'b_note', table: 'b_table', other: 'b_other' }[b.type];
    if (b.type === 'heading') return h('div.rd-block', { style: { textAlign: 'center', background: '#fff1f6', borderColor: '#f6b6d3' } }, h('h2', null, b[L()] || b.fr), b.ar ? ar(b.ar) : null);
    if (b.type === 'note') return h('div', { style: { margin: '10px 0', paddingInlineStart: b.level === 2 ? '22px' : 0 } }, noteEl((b.level === 2 ? '✺ ' : '') + (b[L()] || b.fr)));
    const box = h('div.rd-block.' + b.type, null, h('div.bt', null, h('span', null, t(label))));
    if (b.lines) {
      const all = toks(b);
      box.firstChild.append(h('button.link', { on: { click: async (e) => { e.stopPropagation(); for (const s of all) await W.speak(s, 'ar', { queue: true }); } } }, '▶ ' + t('listenAll')));
      b.lines.forEach((line) => box.append(h('div.rd-line', { dir: 'rtl' }, line.map((s) => tok(s)))));
    } else if (b.type === 'forms') {
      const lbl = b['labels_' + L()] || t('formsLbl');
      box.append(noteEl(b['intro_' + L()] || b.intro_fr || ''),
        h('div.forms', { style: { marginTop: '10px' } }, (b.items || []).map((it) => h('div.f', null, h('button.tok', { lang: 'ar', on: { click: () => W.speak(it.example, 'ar') } }, it.example), h('div.small.muted', null, '← ' + lbl.slice(0, 3).join(' · ')), h('div', null, ar(it.isolated), ' ', h('span.small.muted', null, lbl[3] || ''))))));
    } else if (b.type === 'table') box.append(tableEl(b));
    else if (b.type === 'other') {
      box.append(noteEl(b['desc_' + L()] || b.desc_fr || ''));
      if (b.ar && b.ar.length) box.append(h('div.rd-line', { dir: 'rtl' }, b.ar.map((s) => tok(s))));
    }
    return box;
  };
  const sentenceSpans = (para) => {
    const p = h('p.para', { lang: 'ar', dir: 'rtl' });
    splitSentences(para).forEach((s, i) => {
      if (i) p.append(' ');
      const sp = h('span.s', null, s);
      sp.addEventListener('click', () => { document.querySelectorAll('.s.on,.tok.on').forEach((x) => x.classList.remove('on')); sp.classList.add('on'); W.speak(s, 'ar'); sp.dispatchEvent(new CustomEvent('heard', { bubbles: true })); });
      p.append(sp);
    });
    return p;
  };

  /* ---------- page renderers (list tab = faithful page) ---------- */
  const lessonHead = (p) => h('div.rd-head', null,
    h('div.rd-box', null, h('div.ttl', null, tx(p, 'title')), ar(p.title_ar),
      p.signs_box ? h('div.signs', { dir: 'rtl', style: { marginTop: '6px', borderTop: '2px solid var(--line)', paddingTop: '4px' } },
        (p.signs_box.marks || []).map((m) => ar('ـ' + m)), (p.signs_box.letters || []).map((l) => ar(l))) : null),
    h('div.rd-img', null, p.image ? h('img', { src: p.image, alt: tx(p, 'image_alt'), loading: 'lazy', decoding: 'async', width: 150, height: 150 }) : null),
    h('div.rd-box.rd-letter', null,
      p.letter ? h('button', { on: { click: () => W.speak(p.letter, 'ar') } }, ar([p.letter, p.letter_alt].filter(Boolean).join(' '), 'l')) : null,
      h('button', { on: { click: () => W.speak(p.keyword, 'ar') } }, ar(p.keyword, 'k'))));
  W.renderPage = (p) => {
    const wrap = h('div.rd-page');
    if (p.kind === 'lesson') { wrap.append(lessonHead(p)); p.blocks.forEach((b) => wrap.append(W.renderBlock(b))); }
    else if (p.kind === 'writing') {
      wrap.append(h('h3', { style: { margin: '22px 4px 8px' } }, '✏️ ' + t('writingPage') + ' · ' + t('page') + ' ' + p.page));
      if (p.models && p.models.length) wrap.append(h('div.rd-block', null, h('div.rd-line', { dir: 'rtl' }, p.models.map((m) => tok(m)))));
      const wl = p.word_lines || (p.words ? [p.words] : []);
      if (wl.length) wrap.append(h('div.rd-block.words', null, wl.map((l) => h('div.rd-line', { dir: 'rtl' }, l.map((s) => tok(s))))));
    } else if (p.kind === 'info') p.blocks.forEach((b) => wrap.append(W.renderBlock(b)));
    else if (p.kind === 'alphabet') {
      wrap.append(h('h3', { style: { margin: '22px 4px 10px' } }, t('readIntro')));
      wrap.append(h('div.alpha', { dir: 'rtl' }, p.letters.map((l) => h('button', { on: { click: () => W.speak(l.name, 'ar') } }, h('span.l', { lang: 'ar' }, l.letter), h('span.n', { lang: 'ar' }, l.name)))));
      if (p.note_fr) wrap.append(h('div', { style: { marginTop: '10px' } }, noteEl(p['note_' + L()] || p.note_fr)));
    } else if (p.kind === 'forms_table') {
      const cols = p['columns_' + L()] || p.columns_fr;
      wrap.append(h('h3', { style: { margin: '22px 4px 10px' } }, cols.join(' · ')),
        h('table.ftable', { dir: 'rtl' }, h('thead', null, h('tr', null, cols.map((c) => h('th', null, c)))),
          h('tbody', null, p.rows.map((r) => h('tr' + (r.non_connecting ? '.nc' : ''), { on: { click: () => W.speak(r.name, 'ar') }, style: { cursor: 'pointer' } },
            [r.name, r.initial, r.medial, r.final, r.isolated].map((c) => h('td.ar', { lang: 'ar' }, c)))))));
      if (p.note_fr) wrap.append(h('div', { style: { marginTop: '10px' } }, noteEl(p['note_' + L()] || p.note_fr)));
    } else if (p.kind === 'text') {
      wrap.append(h('div.rd-block', null, h('h2.ar', { style: { textAlign: 'center', fontSize: '34px', color: 'var(--pink)', fontWeight: 700 } }, p.title_ar),
        p.dialogue ? p.dialogue.map((d) => h('div', null, d.speaker ? h('b.ar', { style: { fontSize: '22px', color: 'var(--blue-t)', display: 'block', textAlign: 'right' } }, d.speaker + ' :') : null, sentenceSpans(d.ar)))
          : p.verses ? [p.paragraphs.filter((x) => !p.verses.some((v) => x.startsWith(v[0]))).map(sentenceSpans), p.verses.map((v) => h('div.rd-line', { dir: 'rtl', style: { justifyContent: 'space-between', gap: '6px 22px' } }, v.map((s) => tok(s))))]
          : p.paragraphs.map(sentenceSpans)));
      if (p.note_fr) wrap.append(noteEl(p['note_' + L()] || p.note_fr));
    } else if (p.kind === 'surah') {
      p.items.forEach((it) => {
        const nums = it.ayah_numbers || it.ayat.map((_, i) => i + 1);
        wrap.append(h('div.rd-block.surah-card', null, h('h3', { lang: 'ar' }, it.name_ar),
          it.basmala ? h('p.ayah', { style: { textAlign: 'center', cursor: 'pointer' }, on: { click: () => W.speak(it.basmala, 'ar') } }, it.basmala, it.basmala_ayah_number ? h('span.ayah-n', null, String(it.basmala_ayah_number)) : null) : null,
          h('div', { dir: 'rtl', style: { textAlign: 'right' } }, it.ayat.map((a, i) => h('p.ayah', { style: { cursor: 'pointer' }, on: { click: () => W.speak(a, 'ar') } }, a, h('span.ayah-n', null, String(nums[i])))))));
      });
    } else if (p.kind === 'adhkar') {
      wrap.append(h('div.rd-block', null, h('h3.ar', { style: { textAlign: 'center', fontSize: '28px' } }, p.title_ar),
        p.items.map((it) => h('div', { style: { margin: '10px 0' } }, it.intro_ar ? h('div.ar', { style: { fontSize: '20px', color: 'var(--ink2)' } }, it.intro_ar) : null,
          h('p.ayah', { style: { fontWeight: 700, cursor: 'pointer' }, on: { click: () => W.speak(it.ar, 'ar') } }, it.ar)))));
      if (p.note_fr) wrap.append(noteEl(p['note_' + L()] || p.note_fr));
    }
    return wrap;
  };

  /* ---------- tracing (writing) ---------- */
  const traceLine = (model, ghost) => {
    const line = h('div.wline', null, h('div.model', { lang: 'ar' }, model), h('div.ghost', { lang: 'ar' }, Array(ghost || 4).fill(model).map((m) => h('span', null, m))));
    const cv = h('canvas'); line.append(cv);
    let ctx, drawing = false, last;
    const fit = () => { const r = line.getBoundingClientRect(); const d = Math.min(2, devicePixelRatio || 1); cv.width = r.width * d; cv.height = r.height * d; ctx = cv.getContext('2d'); ctx.scale(d, d); ctx.lineCap = ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = '#1cb0f6'; };
    const pos = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.addEventListener('pointerdown', (e) => { if (!ctx) fit(); drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', (e) => { if (!drawing) return; const p = pos(e); ctx.beginPath(); ctx.moveTo(...last); ctx.lineTo(...p); ctx.stroke(); last = p; });
    cv.addEventListener('pointerup', () => (drawing = false));
    line._clear = () => ctx && ctx.clearRect(0, 0, cv.width, cv.height);
    return line;
  };

  /* ---------- guided reading (game) ---------- */
  const guided = (node) => async (P) => {
    const pages = node.kind === 'lesson' ? [node.page] : node.pages || [node.page];
    const steps = [];
    pages.forEach((p) => {
      if (p.kind === 'lesson') { steps.push({ head: p }); p.blocks.forEach((b) => steps.push({ block: b })); }
      else if (p.kind === 'info') p.blocks.forEach((b) => steps.push({ block: b }));
      else steps.push({ page: p });
    });
    for (let i = 0; i < steps.length; i++) {
      P.progress(i / steps.length);
      const s = steps[i];
      let content, items = [];
      if (s.head) content = lessonHead(s.head);
      else if (s.block) { content = W.renderBlock(s.block); if (s.block.lines) items = toks(s.block); }
      else content = W.renderPage(s.page);
      const heard = new Set();
      const node2 = h('div', null, h('div.muted.small', { style: { textAlign: 'center', marginBottom: '6px' } }, t('readTap')), content);
      const btn = h('button.btn', { on: { click: () => P._next && P._next() } }, t('nextBlock'));
      node2.addEventListener('heard', (e) => { heard.add(e.target.textContent); });
      P.show(node2); P.footer(btn); P._keys = null;
      await new Promise((r) => (P._next = r));
      if (P.closed) return;
      // listening check after a block of items
      const uniq = [...new Set(items)].map((a) => ({ ar: a, t: '' }));
      if (uniq.length >= 2 && ['letters', 'syllables', 'words'].includes(s.block && s.block.type)) {
        const target = uniq[(Math.random() * uniq.length) | 0];
        await W.qListen(P, target, uniq, Math.min(uniq.length, uniq.length > 4 ? 3 : 2));
        if (P.closed) return;
      }
    }
    return { xp: 15 };
  };
  const writing = (node) => async (P) => {
    const wp = node.writing; if (!wp) return { xp: 0 };
    const models = wp.models || [];
    const lines = models.map((m) => traceLine(m, 4));
    const words = (wp.word_lines || (wp.words ? [wp.words] : [])).flat();
    const wl = words.map((w) => traceLine(w, 1));
    const clear = h('button.btn.outline', { on: { click: () => [...lines, ...wl].forEach((l) => l._clear()) } }, t('clear'));
    P.show(h('div', null, h('div.qtitle', null, '✏️ ' + t('g_write')), h('p.muted', null, t('traceTip')), h('div.writing', null, lines, wl)));
    P.progress(0.5);
    await new Promise((r) => P.footer(clear, h('button.btn', { on: { click: r } }, t('cont'))));
    return { xp: 5 };
  };

  W.readingGames = (node) => {
    const items = W.readingItems(node);
    const list = [{ id: 'guided', run: guided(node) }];
    if (items.length >= 2) list.push({ id: 'listen', run: (P) => W.GAMES.listen(P, items) });
    if (items.length >= 3) list.push({ id: 'lpairs', run: (P) => W.GAMES.lpairs(P, items) });
    if (node.writing) list.push({ id: 'write', run: writing(node), emoji: '✏️' });
    return list;
  };
  W.gameMeta.write = ['✏️', '#ffe8f2'];
  W.readingPagesOf = (node) => (node.kind === 'lesson' ? [node.page, node.writing].filter(Boolean) : node.pages || [node.page]);
})();
