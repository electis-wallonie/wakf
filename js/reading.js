/* Wakf — "Learn How to Read": the book, page by page, in the book's exact order (pure learning, no games) */
(function () {
  'use strict';
  const { h, t, ar } = W;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const tx = (o, k) => (o ? o[k + '_' + L()] || o[k + '_fr'] || o[k + '_en'] || '' : '');
  const tr2 = (fr, en) => (W.lang === 'en' ? en : fr);

  /* ---------- book structure ---------- */
  W.bookPages = (book) => book.pages.slice().sort((a, b) => a.page - b.page);
  W.bookSections = (book) => {
    const P = W.bookPages(book);
    const by = {}; P.forEach((p) => (by[p.page] = p));
    const S = [
      { key: 'basics', title: tr2('Les bases : signes, alphabet, formes', 'The basics: signs, alphabet, forms'), items: [] },
      { key: 'part1', title: tr2('1ʳᵉ partie — les 29 leçons', 'Part 1 — the 29 lessons'), items: [] },
      { key: 'part2', title: tr2('2ᵉ partie — textes de lecture', 'Part 2 — reading texts'), items: [] },
      { key: 'surahs', title: tr2('Sourates et invocations', 'Surahs and invocations'), items: [] },
    ];
    P.forEach((p) => {
      const sec = p.page <= 7 ? 0 : p.page <= 68 ? 1 : p.page <= 90 ? 2 : 3;
      if (p.kind === 'writing') return; // listed with its lesson
      const it = { page: p.page, label: W.pageLabel(p), glyph: p.kind === 'lesson' ? p.letter || 'ال' : null };
      if (p.kind === 'lesson' && by[p.page + 1] && by[p.page + 1].kind === 'writing') it.writing = p.page + 1;
      S[sec].items.push(it);
    });
    return S.filter((s) => s.items.length);
  };
  W.pageLabel = (p) => {
    switch (p.kind) {
      case 'cover': return tr2('Couverture', 'Cover');
      case 'calligraphy': return tr2('Basmala', 'Basmala');
      case 'preface': return p.title_fr ? tx(p, 'title') : tr2('Préface (suite)', 'Preface (continued)');
      case 'info': return tr2('Les signes', 'The signs');
      case 'alphabet': return tr2('L’alphabet', 'The alphabet');
      case 'forms_table': return tr2('Les formes des lettres', 'Letter forms');
      case 'part_title': return tx(p, 'title');
      case 'lesson': return tx(p, 'title');
      case 'writing': return tr2('Page d’écriture', 'Writing page');
      case 'text': return p.title_ar;
      case 'surah': return p.items.map((i) => i.name_ar).join(' · ');
      case 'adhkar': return p.title_ar;
      case 'toc': return tr2('Sommaire du livre', 'Book contents');
      case 'blank': return tr2('Page blanche', 'Blank page');
      default: return tr2('Page', 'Page') + ' ' + p.page;
    }
  };
  // pages that count for progress (blank pages excluded)
  W.bookCountable = (book) => W.bookPages(book).filter((p) => p.kind !== 'blank');

  /* ---------- touchable items (audio) ---------- */
  const pad = (n, k) => String(n).padStart(k || 2, '0');
  const tok = (s, key, cls) => {
    const b = h('button.tok' + (cls ? '.' + cls : ''), { lang: 'ar', dir: 'rtl', 'data-audio': key }, s);
    b.addEventListener('click', () => { document.querySelectorAll('.tok.on,.s.on').forEach((x) => x.classList.remove('on')); b.classList.add('on'); W.say(s, key); });
    return b;
  };
  const noteEl = (txt) => h('div.rd-note', { dir: 'ltr' }, txt);
  const blockTitle = { letters: ['Les voyelles', 'The vowels'], syllables: ['Syllabes', 'Syllables'], words: ['Mots', 'Words'], sentences: ['Phrases', 'Sentences'], forms: ['Les formes', 'Letter forms'], table: ['Tableau', 'Table'], other: ['Remarque', 'Note'] };
  const tableEl = (b, kp) => {
    const cols = b['columns_' + L()] || b.columns_fr || [];
    const rows = (L() === 'en' && b.rows_en) || b.rows || [];
    return h('div', null, b['title_' + L()] || b.title_fr ? h('h3', { style: { margin: '2px 0 8px', fontSize: '16px' } }, b['title_' + L()] || b.title_fr) : null,
      h('table.ftable', null, h('thead', null, h('tr', null, cols.map((c) => h('th', null, c)))),
        h('tbody', null, rows.map((r, ri) => h('tr', null, r.map((c, ci) => (/[؀-ۿ]/.test(c) && !/[a-z]/i.test(c) ? h('td', null, tok(c, kp + '-' + pad(ri) + pad(ci))) : h('td', null, c))))))));
  };
  const renderBlock = (b, page, bi) => {
    const kp = 'livre/p' + pad(page, 3) + '-' + pad(bi + 1);
    if (b.type === 'heading') return h('div.rd-block.head', null, h('h2', null, b[L()] || b.fr), b.ar ? h('div', { style: { marginTop: '4px' } }, tok(b.ar, kp)) : null);
    if (b.type === 'note') return h('div.rd-notewrap' + (b.level === 2 ? '.l2' : ''), null, noteEl(b[L()] || b.fr));
    const bt = blockTitle[b.type] || ['', ''];
    const box = h('div.rd-block.' + b.type, null, h('div.bt', null, h('span', null, tr2(bt[0], bt[1]))));
    if (b.lines) {
      let k = 0;
      const items = [];
      b.lines.forEach((line) => box.append(h('div.rd-line', { dir: 'rtl' }, line.map((s) => { k++; const key = kp + '-' + pad(k); items.push([s, key]); return tok(s, key); }))));
      box.firstChild.append(h('button.link', { html: W.svg('speaker'), on: { click: async (e) => { e.stopPropagation(); for (const [s, key] of items) await W.say(s, key, { queue: true }); } } }, tr2('Tout écouter', 'Listen to all')));
    } else if (b.type === 'forms') {
      const lbl = b['labels_' + L()] || (W.lang === 'en' ? ['At the beginning', 'In the middle', 'At the end', 'On its own'] : ['Au début', 'Au milieu', 'À la fin', 'Tout seul']);
      box.append(noteEl(b['intro_' + L()] || b.intro_fr || ''),
        h('div.formsg', null, (b.items || []).map((it, i) => h('div.f', null, tok(it.example, kp + '-' + pad(i * 2 + 1)), h('div.small.muted', null, lbl.slice(0, 3).join(' · ')), h('div', null, tok(it.isolated, kp + '-' + pad(i * 2 + 2)), ' ', h('span.small.muted', null, lbl[3] || ''))))));
    } else if (b.type === 'table') box.append(tableEl(b, kp));
    else if (b.type === 'other') {
      box.append(noteEl(b['desc_' + L()] || b.desc_fr || ''));
      if (b.ar && b.ar.length) box.append(h('div.rd-line', { dir: 'rtl' }, b.ar.map((s, i) => tok(s, kp + '-' + pad(i + 1)))));
    }
    return box;
  };
  const splitSentences = (s) => s.split(/(?<=[\.،؛؟!:])\s+/).map((x) => x.trim()).filter(Boolean);
  const sentenceSpans = (para, kp) => {
    const p = h('p.para', { lang: 'ar', dir: 'rtl' });
    splitSentences(para).forEach((s, i) => {
      if (i) p.append(' ');
      const key = kp + '-' + pad(i + 1);
      const sp = h('span.s', { 'data-audio': key, role: 'button', tabindex: 0 }, s);
      const go = () => { document.querySelectorAll('.s.on,.tok.on').forEach((x) => x.classList.remove('on')); sp.classList.add('on'); W.say(s, key); };
      sp.addEventListener('click', go); sp.addEventListener('keydown', (e) => { if (e.key === 'Enter') go(); });
      p.append(sp);
    });
    return p;
  };

  /* ---------- one book page ---------- */
  const lessonHead = (p) => h('div.rd-head', null,
    h('div.rd-box', null, h('div.ttl', null, tx(p, 'title')), ar(p.title_ar),
      p.signs_box ? h('div.signs', { dir: 'rtl' }, (p.signs_box.marks || []).map((m) => ar('ـ' + m)), (p.signs_box.letters || []).map((l) => ar(l))) : null),
    h('div.rd-img', null, p.image ? h('img', { src: p.image, alt: tx(p, 'image_alt'), decoding: 'async', width: 150, height: 150 }) : null),
    h('div.rd-box.rd-letter', null,
      p.letter ? tok([p.letter, p.letter_alt].filter(Boolean).join(' '), 'livre/p' + pad(p.page, 3) + '-00-01', 'l') : null,
      tok(p.keyword, 'livre/p' + pad(p.page, 3) + '-00-02', 'k')));
  W.renderBookPage = (p) => {
    const kp = 'livre/p' + pad(p.page, 3);
    const wrap = h('article.bookpage.k-' + p.kind);
    switch (p.kind) {
      case 'cover':
        wrap.append(h('div.cover', null, tok(p.title_ar, kp + '-01', 'cv'), tok(p.level_ar, kp + '-02', 'lv'))); break;
      case 'calligraphy':
        wrap.append(h('div.callig', null, h('img', { src: p.image, alt: tx(p, 'alt'), decoding: 'async' }), tok(p.ar, kp + '-01'))); break;
      case 'preface':
        if (p.basmala) wrap.append(h('div', { style: { textAlign: 'center' } }, tok(p.basmala, kp + '-01')));
        if (p.title_fr) wrap.append(h('h2.pref-t', null, tx(p, 'title')));
        (p['paras_' + L()] || p.paras_fr).forEach((s) => wrap.append(s.startsWith('##') ? h('h3.pref-h', null, s.slice(2)) : s.startsWith('@') ? h('p.pref-sign', null, s.slice(1)) : h('p.pref', null, s)));
        break;
      case 'part_title':
        wrap.append(h('div.cover', null, tok(p.title_ar, kp + '-01', 'cv'), h('div.pt', null, tx(p, 'title')))); break;
      case 'blank':
        wrap.append(h('div.empty', null, h('p', null, tr2('Cette page est laissée blanche dans le livre.', 'This page is left blank in the book.')))); break;
      case 'lesson':
        wrap.append(lessonHead(p)); p.blocks.forEach((b, i) => wrap.append(renderBlock(b, p.page, i))); break;
      case 'info':
        p.blocks.forEach((b, i) => wrap.append(renderBlock(b, p.page, i))); break;
      case 'writing': {
        const lines = h('div.wlines');
        (p.models || []).forEach((m, i) => lines.append(h('div.wl', null, tok(m, kp + '-m' + pad(i + 1)))));
        (p.word_lines || (p.words ? [p.words] : [])).forEach((l, li) => lines.append(h('div.wl.words', { dir: 'rtl' }, l.map((s, i) => tok(s, kp + '-w' + pad(li + 1) + pad(i + 1))))));
        lines.append(h('div.wl'), h('div.wl'));
        wrap.append(h('p.muted.small', { style: { textAlign: 'center', margin: '0 0 10px' } }, tr2('Recopie chaque modèle sur ton cahier, de droite à gauche.', 'Copy each model into your notebook, from right to left.')), lines);
        break;
      }
      case 'alphabet':
        wrap.append(h('div.alpha', { dir: 'rtl' }, p.letters.map((l, i) => { const b = h('button', null, h('span.l', { lang: 'ar' }, l.letter), h('span.n', { lang: 'ar' }, l.name)); b.addEventListener('click', () => W.say(l.name, kp + '-' + pad(i + 1))); return b; })));
        if (p.note_fr) wrap.append(h('div', { style: { marginTop: '12px' } }, noteEl(p['note_' + L()] || p.note_fr)));
        break;
      case 'forms_table': {
        const cols = p['columns_' + L()] || p.columns_fr;
        wrap.append(h('table.ftable', { dir: 'rtl' }, h('thead', null, h('tr', null, cols.map((c) => h('th', null, c)))),
          h('tbody', null, p.rows.map((r, ri) => h('tr' + (r.non_connecting ? '.nc' : ''), null, [r.name, r.initial, r.medial, r.final, r.isolated].map((c, ci) => h('td', null, ci === 0 ? tok(c, kp + '-' + pad(ri + 1)) : h('span.ar', { lang: 'ar' }, c))))))));
        if (p.note_fr) wrap.append(h('div', { style: { marginTop: '12px' } }, noteEl(p['note_' + L()] || p.note_fr)));
        break;
      }
      case 'text': {
        const box = h('div.rd-block.text', null, h('h2.ar.tt', { lang: 'ar' }, tok(p.title_ar, kp + '-00')));
        if (p.dialogue) p.dialogue.forEach((d, i) => box.append(h('div', null, d.speaker ? h('b.ar.spk', { lang: 'ar' }, d.speaker + ' :') : null, sentenceSpans(d.ar, kp + '-' + pad(i + 1)))));
        else if (p.verses) {
          p.paragraphs.filter((x) => !p.verses.some((v) => x.startsWith(v[0]))).forEach((x, i) => box.append(sentenceSpans(x, kp + '-' + pad(i + 1))));
          p.verses.forEach((v, i) => box.append(h('div.rd-line.verse', { dir: 'rtl' }, v.map((s, j) => tok(s, kp + '-v' + pad(i + 1) + pad(j + 1))))));
        } else p.paragraphs.forEach((x, i) => box.append(sentenceSpans(x, kp + '-' + pad(i + 1))));
        wrap.append(box);
        if (p.note_fr) wrap.append(noteEl(p['note_' + L()] || p.note_fr));
        break;
      }
      case 'surah':
        p.items.forEach((it, si) => {
          const nums = it.ayah_numbers || it.ayat.map((_, i) => i + 1);
          wrap.append(h('div.rd-block.surah-card', null, h('h3', { lang: 'ar' }, it.name_ar),
            it.basmala ? h('p.ayah.c', null, tok(it.basmala, kp + '-' + (si + 1) + '-00'), it.basmala_ayah_number ? h('span.ayah-n', null, String(it.basmala_ayah_number)) : null) : null,
            h('div', { dir: 'rtl', style: { textAlign: 'right' } }, it.ayat.map((a, i) => h('p.ayah', null, tok(a, kp + '-' + (si + 1) + '-' + pad(nums[i])), h('span.ayah-n', null, String(nums[i])))))));
        });
        break;
      case 'adhkar':
        wrap.append(h('div.rd-block', null, h('h3.ar.tt', { lang: 'ar' }, p.title_ar),
          p.items.map((it, i) => h('div.dhikr', null, it.intro_ar ? h('div.ar.intro', { lang: 'ar' }, it.intro_ar) : null, h('p.ayah', null, tok(it.ar, kp + '-' + pad(i + 1)))))));
        if (p.note_fr) wrap.append(noteEl(p['note_' + L()] || p.note_fr));
        break;
      case 'toc':
        wrap.append(h('div.rd-block', null, p.title_fr ? h('h3', null, tx(p, 'title')) : null,
          h('div.toclist', null, p.entries.map((e) => h('a.tocrow', { href: '#/t/read/p/' + e.page }, h('span' + (/[؀-ۿ]/.test(e.label) ? '.ar' : ''), null, (L() === 'en' && e.label_en) || e.label), h('b', null, String(e.page)))))));
        break;
    }
    return wrap;
  };
})();
