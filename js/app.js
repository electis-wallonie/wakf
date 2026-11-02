/* Wakf — views & routes */
(function () {
  'use strict';
  const { h, t, ar } = W;
  const S = W.state;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');
  const svg = (n) => W.svg(n);
  const ico = (n, tag) => h(tag || 'span', { html: svg(n), style: { display: 'inline-flex' } });

  /* ---------- rubrics ---------- */
  const THEMES = {
    surah: { cls: 't-surah', key: 'th_surah', icon: 'surah', color: 'lapis', art: 'surah' },
    w85: { cls: 't-w85', key: 'th_w85', icon: 'quran', color: 'jade', art: 'quran', data: 'words85', size: 20 },
    read: { cls: 't-read', key: 'th_read', icon: 'read', color: 'amethyste', art: 'read', data: 'reading' },
    w1000: { cls: 't-w1000', key: 'th_w1000', icon: 'words', color: 'safran', art: 'words', data: 'words1000', size: 20 },
  };
  const ORDER = ['w85', 'read', 'surah', 'w1000'];
  const cvar = (c, s) => 'var(--' + c + (s ? '-' + s : '') + ')';
  const SURAHS = [{ n: 1, data: 'fatiha' }, { n: 2, data: 'baqara' }, { n: 3, data: 'imran' }, { n: 4, data: 'nisa' }, { n: 5, data: 'maida' }, { n: 6, data: 'anam' }, { n: 7, data: 'araf' }, { n: 8, data: 'anfal' }, { n: 9, data: 'tawba' }, { n: 10, data: 'yunus' }, { n: 11, data: 'hud' }, { n: 12, data: 'yusuf' }, { n: 13, data: 'rad' }, { n: 14, data: 'ibrahim' }, { n: 15, data: 'hijr' }, { n: 16, data: 'nahl' }, { n: 17, data: 'isra' }, { n: 18, data: 'kahf' }, { n: 19, data: 'maryam' }, { n: 20, data: 'taha' }, { n: 21, data: 'anbiya' }, { n: 22, data: 'hajj' }, { n: 23, data: 'muminun' }, { n: 24, data: 'nur' }, { n: 25, data: 'furqan' }, { n: 26, data: 'shuara' }, { n: 27, data: 'naml' }, { n: 33, data: 'ahzab' }, { n: 36, data: 'yasin' }, { n: 106, data: 'quraysh' }, { n: 107, data: 'maun' }, { n: 108, data: 'kawthar' }, { n: 109, data: 'kafirun' }, { n: 110, data: 'nasr' }, { n: 111, data: 'masad' }, { n: 112, data: 'ikhlas' }, { n: 113, data: 'falaq' }, { n: 114, data: 'nas' }, { n: 34, data: 'saba' }, { n: 35, data: 'fatir' }, { n: 37, data: 'saffat' }, { n: 38, data: 'sad' }, { n: 39, data: 'zumar' }, { n: 40, data: 'ghafir' }, { n: 41, data: 'fussilat' }, { n: 42, data: 'shura' }, { n: 44, data: 'dukhan' }, { n: 45, data: 'jathiya' }, { n: 48, data: 'fath' }, { n: 43, data: 'zukhruf' }, { n: 46, data: 'ahqaf' }, { n: 47, data: 'muhammad' }, { n: 49, data: 'hujurat' }, { n: 50, data: 'qaf' }, { n: 51, data: 'dhariyat' }, { n: 52, data: 'tur' }, { n: 53, data: 'najm' }, { n: 54, data: 'qamar' }, { n: 56, data: 'waqia' }, { n: 57, data: 'hadid' }, { n: 58, data: 'mujadila' }, { n: 62, data: 'jumua' }, { n: 28, data: 'qasas' }, { n: 29, data: 'ankabut' }, { n: 30, data: 'rum' }, { n: 31, data: 'luqman' }, { n: 32, data: 'sajda' }, { n: 59, data: 'hashr' }, { n: 60, data: 'mumtahina' }, { n: 61, data: 'saff' }, { n: 63, data: 'munafiqun' }, { n: 64, data: 'taghabun' }, { n: 65, data: 'talaq' }, { n: 66, data: 'tahrim' }, { n: 67, data: 'mulk' }, { n: 73, data: 'muzzammil' }, { n: 74, data: 'muddaththir' }, { n: 69, data: 'haqqa' }, { n: 79, data: 'naziat' }, { n: 80, data: 'abasa' }, { n: 81, data: 'takwir' }, { n: 82, data: 'infitar' }, { n: 83, data: 'mutaffifin' }, { n: 84, data: 'inshiqaq' }, { n: 85, data: 'buruj' }, { n: 86, data: 'tariq' }, { n: 87, data: 'ala' }, { n: 88, data: 'ghashiya' }, { n: 89, data: 'fajr' }, { n: 90, data: 'balad' }, { n: 91, data: 'shams' }, { n: 92, data: 'layl' }, { n: 93, data: 'duha' }, { n: 94, data: 'sharh' }, { n: 95, data: 'tin' }, { n: 96, data: 'alaq' }, { n: 97, data: 'qadr' }, { n: 98, data: 'bayyina' }, { n: 99, data: 'zalzala' }, { n: 100, data: 'adiyat' }, { n: 101, data: 'qaria' }, { n: 102, data: 'takathur' }, { n: 103, data: 'asr' }, { n: 104, data: 'humaza' }, { n: 105, data: 'fil' }, { n: 68, data: 'qalam' }, { n: 70, data: 'maarij' }, { n: 71, data: 'nuh' }, { n: 72, data: 'jinn' }, { n: 75, data: 'qiyama' }, { n: 77, data: 'mursalat' }, { n: 78, data: 'naba' }, { n: 55, data: 'rahman' }, { n: 76, data: 'insan' }].sort((a, b) => a.n - b.n);

  /* ---------- word data ---------- */
  const wordsCache = {};
  const getWords = async (th) => {
    const key = th + ':' + L();
    if (wordsCache[key]) return wordsCache[key];
    const d = await W.load(THEMES[th].data);
    if (!d || !d.words || !d.words.length) return null;
    const folder = th === 'w85' ? 'mots85' : 'mots1000';
    const items = d.words.map((w) => ({
      id: th + '-' + w.n, n: w.n, th, ar: w.ar, t: (L() === 'en' ? w.en : w.fr) || '',
      extra: w.extra_ar || '', forms: w.forms || null, tag: w.tag || '', cat: (L() === 'en' ? w.cat : w.cat_fr) || '', note: (L() === 'en' ? w.note_en : w.note_fr) || '',
      group: (L() === 'en' ? w.group_en : w.group_fr) || '', lesson: w.lesson || Math.floor((w.n - 1) / 20) + 1,
      audio: folder + '/' + String(w.n).padStart(4, '0'),
    }));
    // lessons are fixed in the data (field "lesson"): correcting a list never shifts saved progress
    const lessons = [];
    items.forEach((w) => { (lessons[w.lesson - 1] = lessons[w.lesson - 1] || []).push(w); });
    return (wordsCache[key] = { items, lessons, playable: items.filter((w) => w.t), src: d });
  };
  const allWords = async () => { const out = []; for (const th of ['w85', 'w1000']) { const d = await getWords(th); if (d) out.push(...d.items); } return out; };
  const lessonId = (th, n) => th + '-L' + n;
  const lessonDone = (id) => S.lessons[id] && S.lessons[id].exam != null && S.lessons[id].exam >= 80;

  /* ---------- navigation chrome ---------- */
  const NAV = [['#/', 'learn', 'tab_learn'], ['#/review', 'review', 'tab_review'], ['#/lexicon', 'lexicon', 'tab_lexicon']];
  let tabbar;
  const isOn = (href) => { const hs = location.hash || '#/'; return href === '#/' ? !/^#\/(review|lexicon)/.test(hs) : hs.startsWith(href); };
  W.updateNav = () => {
    const rail = W.$('#rail');
    if (!W.lang || /^#\/lang/.test(location.hash)) { rail.replaceChildren(); tabbar && tabbar.remove(); tabbar = null; return; }
    const due = W.dueIds().length;
    const badge = () => (due ? h('span.badge', { 'aria-label': due + ' ' + t('reviewDue') }, due > 99 ? '99+' : String(due)) : null);
    rail.replaceChildren(h('a.brand', { href: '#/', html: '<span class="lg">' + W.LOGO + '</span>wakf' }),
      ...NAV.map(([href, ic, k]) => h('a' + (isOn(href) ? '.on' : ''), { href, 'aria-current': isOn(href) ? 'page' : null, html: svg(ic) }, t(k), k === 'tab_review' ? badge() : null)),
      h('span.sp'), ...(isDemo() ? [h('button.demo', { on: { click: newVisitor }, html: svg('demo') }, W.lang === 'en' ? 'New visitor' : 'Nouveau visiteur')] : []), h('button', { on: { click: openSettings }, html: svg('settings') }, t('settings')));
    if (!tabbar) { tabbar = h('nav.tabbar', { 'aria-label': 'Navigation' }); document.body.append(tabbar); new ResizeObserver(() => document.documentElement.style.setProperty('--tabh', (getComputedStyle(tabbar).display === 'none' ? 0 : tabbar.offsetHeight) + 'px')).observe(tabbar); }
    tabbar.replaceChildren(...NAV.map(([href, ic, k]) => h('a' + (isOn(href) ? '.on' : ''), { href, 'aria-current': isOn(href) ? 'page' : null, html: svg(ic) }, t(k), k === 'tab_review' ? badge() : null)));
  };
  // top bar: root pages show the logo, inner pages a back button + title
  const appbar = ({ back, title, sub }) => h('header.appbar', null,
    back ? h('a.iconbtn', { href: back, 'aria-label': t('backLbl'), html: svg('back') }) : h('a.brand', { href: '#/', html: '<span class="lg">' + W.LOGO + '</span>wakf' }),
    h('div.grow', null, back && title ? h('div.ttl', null, title) : null, back && sub ? h('div.sub', null, sub) : null),
    isDemo() ? h('button.iconbtn.gear.demo', { 'aria-label': W.lang === 'en' ? 'New visitor' : 'Nouveau visiteur', title: W.lang === 'en' ? 'New visitor' : 'Nouveau visiteur', html: svg('demo'), on: { click: newVisitor } }) : null,
    h('button.iconbtn.gear', { 'aria-label': t('settingsLbl'), html: svg('settings'), on: { click: openSettings } }));

  /* ---------- settings sheet ---------- */
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
  function openSettings() {
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    const close = () => { scrim.remove(); document.removeEventListener('keydown', onKey, true); };
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    const langSeg = h('div.minseg', null, ['fr', 'en'].map((l) => h('button' + (W.lang === l ? '.on' : ''), { on: { click: () => { if (W.lang !== l) { close(); setLang(l, true); } } } }, l === 'fr' ? 'Français' : 'English')));
    const row = (icn, title, sub, right, onClick) => h(onClick ? 'button.row' : 'div.row', { on: onClick ? { click: onClick } : null, style: onClick ? { width: '100%', textAlign: 'left' } : null },
      h('span.ri', { html: svg(icn) }), h('span.grow', null, h('b', null, title), h('span', null, sub)), right || null);
    const box = h('div.dialog.settings', { role: 'dialog', 'aria-modal': 'true', 'aria-label': t('settings') },
      h('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' } }, h('h2', { style: { margin: 0 } }, t('settings')), h('button.iconbtn', { 'aria-label': t('close'), html: svg('close'), on: { click: close } })),
      row('language', t('language'), t('languageSub'), langSeg),
      standalone ? row('install', t('installed'), t('installSub')) : row('install', t('install'), t('installSub'), ico('next'), async () => {
        if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } else W.toast(t('installHelp'), 7000);
      }),
      row('demo', W.lang === 'en' ? 'Demo mode' : 'Mode démo', W.lang === 'en' ? 'Institute PC: progress is erased for each new visitor' : 'PC de l’institut : la progression est effacée à chaque nouveau visiteur',
        h('div.minseg', null, [[true, W.lang === 'en' ? 'On' : 'Oui'], [false, W.lang === 'en' ? 'Off' : 'Non']].map(([v, l]) => h('button' + (isDemo() === v ? '.on' : ''), { on: { click: () => { try { v ? localStorage.setItem(DEMO_KEY, '1') : localStorage.removeItem(DEMO_KEY); } catch (e) {} close(); if (v) { W.toast(W.lang === 'en' ? 'Demo mode on' : 'Mode démo activé'); setTimeout(() => location.reload(), 700); } else { W.toast(W.lang === 'en' ? 'Demo mode off' : 'Mode démo désactivé'); W.updateNav(); } } } }, l)))),
      row('reset', t('resetProgress'), t('resetSub'), ico('next'), async () => {
        close();
        const ok = await W.dialog({ title: t('resetTitle'), text: t('resetText'), icon: 'reset', ok: t('erase'), danger: true, color: 'grenade' });
        if (ok) { W.resetAll(); W.toast(t('done2')); W.render(); }
      }));
    const scrim = h('div.scrim', { on: { click: (e) => { if (e.target === scrim) close(); } } }, box);
    document.body.append(scrim); document.addEventListener('keydown', onKey, true);
  }
  const setLang = (l, rerender) => { W.lang = S.lang = l; W.save(); document.documentElement.lang = l; for (const k in wordsCache) delete wordsCache[k]; if (rerender) W.render(); };

  /* ---------- language picker ---------- */
  const flagFR = '<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#002654"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ce1126"/></svg>';
  const flagUK = '<svg viewBox="0 0 60 40"><clipPath id="uk"><rect width="60" height="40"/></clipPath><g clip-path="url(#uk)"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#c8102e" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></g></svg>';
  W.route(/^\/lang$/, (tok) => {
    const pick = (l) => { setLang(l); W.go('#/'); };
    W.mount(h('div.lang', null,
      h('div.hero', { html: W.LOGO }),
      h('div', null, h('div.word', null, 'wakf', h('span', { lang: 'ar' }, 'وقف')), h('div.ar.big', { lang: 'ar' }, 'تَعَلَّمِ الْعَرَبِيَّةَ')),
      h('h1', null, 'Choisis ta langue · Choose your language'),
      h('div.choices', null,
        h('button.langbtn', { lang: 'fr', on: { click: () => pick('fr') } }, h('span.flag', { html: flagFR }), h('span', null, 'Français', h('small', null, 'Tout le site en français')), ico('next', 'span.go')),
        h('button.langbtn', { lang: 'en', on: { click: () => pick('en') } }, h('span.flag', { html: flagUK }), h('span', null, 'English', h('small', null, 'The whole site in English')), ico('next', 'span.go')))), tok);
  });

  /* ---------- home ---------- */
  const themeStatus = async (k) => {
    if (k === 'surah') {
      const opened = SURAHS.filter((s) => S.opened['surah:' + s.n]).length;
      return { frac: opened / SURAHS.length, text: t('progSurah', { a: opened, b: SURAHS.length }), ok: true };
    }
    if (k === 'read') {
      const b = await W.load('reading'); if (!b) return { ok: false };
      const ns = W.bookCountable(b); const read = ns.filter((p) => S.readPages && S.readPages[p.page]).length;
      return { frac: read / ns.length, text: t('progRead', { a: read, b: ns.length }), ok: true };
    }
    const d = await getWords(k); if (!d) return { ok: false };
    const done = d.lessons.filter((_, i) => lessonDone(lessonId(k, i + 1))).length;
    return { frac: done / d.lessons.length, text: t('progLessons', { a: done, b: d.lessons.length }), ok: true };
  };
  W.route(/^\/$/, async (tok) => {
    const page = h('div.page');
    const last = S.last._ && S.last[S.last._];
    let resume;
    if (last) {
      const T = THEMES[S.last._];
      resume = h('a.resume' + (T.color === 'safran' ? '.safran' : ''), { href: last.href, style: { '--c': cvar(T.color), '--cd': cvar(T.color, 'd') } },
        h('span.pl', { html: svg('play') }), h('span', null, h('small', null, t('resume')), h('b', null, t(T.key) + ' · ' + last.label), last.sub ? h('span.s', null, last.sub) : null), h('span.go', { html: svg('next') }));
    } else {
      resume = h('a.resume', { href: '#/t/read', style: { '--c': cvar('amethyste'), '--cd': cvar('amethyste', 'd') } },
        h('span.pl', { html: svg('read') }), h('span', null, h('small', null, t('welcome')), h('b', null, t('startReading')), h('span.s', null, t('welcomeSub'))), h('span.go', { html: svg('next') }));
    }
    const grid = h('div.rubrics');
    const slots = {};
    ORDER.forEach((k) => {
      const T = THEMES[k];
      const bar = h('i'), ptxt = h('span'), cta = h('span.btn.cta', null, t('ctaStart'));
      const card = h('a.rc.' + T.cls + (T.color === 'safran' ? '.safran' : ''), { href: '#/t/' + k },
        h('div.art', { html: W.ART[T.art] }),
        h('div.body', null, h('span.rchip', { html: svg(T.icon) }, t('chip_' + k)), h('h3', null, t(T.key)), h('p', null, t(T.key + '_d')),
          h('div.prog', null, h('span.bar', null, bar), ptxt), cta));
      slots[k] = { bar, ptxt, cta, card };
      grid.append(card);
    });
    page.append(appbar({}), h('div.hello', null, h('h1', null, t('hello')), h('p', null, t('homeSub'))), resume,
      h('div.sect', null, h('h2', null, t('rubrics'))), grid);
    if (!W.mount(page, tok)) return;
    for (const k of ORDER) {
      const st = await themeStatus(k); const sl = slots[k];
      if (!st.ok) { sl.cta.classList.add('off'); sl.cta.textContent = t('soonAvail'); sl.ptxt.textContent = ''; sl.bar.parentNode.style.visibility = 'hidden'; continue; }
      sl.ptxt.textContent = st.text;
      requestAnimationFrame(() => (sl.bar.style.width = Math.max(st.frac * 100, st.frac ? 4 : 0) + '%'));
      const lt = S.last[k];
      sl.cta.textContent = lt ? t('ctaContinue', { x: lt.label.toLowerCase() === lt.label ? lt.label : lt.label.charAt(0).toLowerCase() + lt.label.slice(1) }) : t('ctaStart');
    }
  });

  /* ---------- path helper ---------- */
  const zig = (i) => Math.round(Math.sin(i * 0.9) * 70) + 'px';
  const pathNode = ({ href, label, glyph, done, current, color, i }) => {
    const n = h('a.node' + (done ? '.done' : '') + (current ? '.current' : ''), { href, style: { '--x': zig(i), '--c-t': cvar(color, 'd') }, 'data-start': t('start'), 'aria-label': label });
    let inner;
    if (done) inner = h('span', { html: svg('done'), style: { display: 'grid' } });
    else if (glyph && glyph[0] === '@') inner = h('span', { html: svg(glyph.slice(1)), style: { display: 'grid' } });
    else inner = /[؀-ۿ]/.test(glyph) ? ar(glyph) : glyph;
    n.append(h('span.disc', { style: done ? null : { '--c': cvar(color), '--cd': cvar(color, 'd') } }, inner), h('span.lbl' + (/[؀-ۿ]/.test(label) ? '.ar' : ''), null, label));
    return n;
  };
  const unitHead = (T, kicker, title, sub) => h('div.unit', { style: { '--c': cvar(T.color), '--cd': cvar(T.color, 'd'), color: T.color === 'safran' ? 'var(--nuit)' : '#fff' } },
    h('span.ui', { html: svg(T.icon) }), h('div.grow', null, h('small', null, kicker), h('h2', null, title), sub ? h('div.small', null, sub) : null));
  const emptyState = (icn, title, text) => h('div.card.empty', null, h('div.ei', { html: svg(icn) }), h('h2', null, title), h('p', null, text));

  /* ---------- word rubrics ---------- */
  W.route(/^\/t\/(w85|w1000)$/, async (tok, th) => {
    const T = THEMES[th];
    const page = h('div.page', null, appbar({ back: '#/', title: t(T.key) }));
    const d = await getWords(th);
    if (!d) { page.append(emptyState(T.icon, t('notYet'), t('notYetSub'))); W.mount(page, tok); return; }
    const path = h('div.path');
    const cur = d.lessons.findIndex((_, i) => !lessonDone(lessonId(th, i + 1)));
    d.lessons.forEach((ls, i) => {
      if (i % 5 === 0) {
        const grp = [...new Set(d.lessons.slice(i, i + 5).flat().map((w) => w.group))].slice(0, 3).join(' · ');
        path.append(unitHead(T, t('unitOf') + ' ' + (i / 5 + 1), (Math.min(i + 5, d.lessons.length) > i + 1 ? t('lessonN', { n: i + 1 }) + ' – ' + Math.min(i + 5, d.lessons.length) : t('lessonN', { n: i + 1 })), grp));
      }
      path.append(pathNode({ href: '#/t/' + th + '/l/' + (i + 1), label: t('lessonN', { n: i + 1 }), glyph: String(i + 1), done: lessonDone(lessonId(th, i + 1)), current: i === cur, color: T.color, i }));
    });
    page.append(h('p.muted.small', { style: { textAlign: 'center', margin: '0 0 6px' } }, t('wordsN', { n: d.items.length }) + ' · ' + d.lessons.length + ' ' + t('lessonsWord')), path,
      d.src.conjugation ? h('a.card.press.conjlink', { href: '#/t/' + th + '/conj' }, h('span.gi', { html: svg('list') }), h('span', null, h('h3', null, W.lang === 'en' ? 'Conjugation tables' : 'Tableaux de conjugaison'), h('p', null, W.lang === 'en' ? 'Reference: the patterns of the verb فَعَلَ' : 'Référence : les modèles du verbe فَعَلَ'))) : null);
    if (!W.mount(page, tok)) return;
    const c = page.querySelector('.node.current'); if (c && cur > 2) setTimeout(() => c.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
  });

  const segCtl = (i, onSwitch, color) => {
    const seg = h('div.seg', { 'data-i': i, role: 'tablist', style: color ? { '--seg-c': cvar(color, 'd') } : null }, h('span.thumb'));
    [['games', 'tabGame'], ['list', 'tabList']].forEach(([icn, k], j) => seg.append(h('button' + (j === i ? '.on' : ''), { role: 'tab', 'aria-selected': String(j === i), html: svg(icn),
      on: { click: () => { if (+seg.dataset.i === j) return; seg.dataset.i = j; seg.querySelectorAll('button').forEach((b, m) => { b.classList.toggle('on', m === j); b.setAttribute('aria-selected', String(m === j)); }); onSwitch(j); } } }, t(k))));
    return seg;
  };
  const FORM_LBL = { fr: ['Passé', 'Présent', 'Impératif', 'Participe actif', 'Participe passif', 'Nom verbal'], en: ['Past', 'Present', 'Imperative', 'Active participle', 'Passive participle', 'Verbal noun'] };
  const formsGrid = (w) => h('div.vforms', { dir: 'rtl' }, ['past', 'present', 'imperative', 'active_participle', 'passive_participle', 'verbal_noun'].map((k, i) => w.forms[k] && w.forms[k] !== '-' ?
    h('button.vf', { on: { click: () => W.say(w.forms[k], w.audio + '/' + k) } }, h('span.ar', { lang: 'ar' }, w.forms[k]), h('small', { dir: 'ltr' }, FORM_LBL[L()][i])) : null));
  const GICON = { flash: 'flash', pairs: 'pairs', trans: 'trans', hear: 'hear', guided: 'pageRead', listen: 'speaker', lpairs: 'pairs', write: 'read' };
  const gameCard = (g, done, onClick) => h('button.card.press.game', { on: { click: onClick } },
    (W.BADGE[g] ? h('span.gb', { html: W.BADGE[g] }) : h('span.gi.g-' + g, { html: svg(GICON[g]) })), h('span', null, h('h3', null, t('g_' + g)), h('p', null, t('g_' + g + '_d'))), done ? h('span.chk', { html: svg('ok') }) : null);
  const examWidget = (st, onClick) => h('button.examw', { on: { click: onClick } },
    h('span.eb', { html: W.BADGE.exam }), h('span', null, h('h3', null, t('g_exam')), h('p', null, t('g_exam_d'))),
    h('span.sc', null, h('b', null, st.examRaw || (st.exam != null ? st.exam + ' %' : '–')), h('span', null, W.lang === 'en' ? 'last score' : 'dernier score')));

  W.route(/^\/t\/(w85|w1000)\/l\/(\d+)$/, async (tok, th, n) => {
    n = +n; const d = await getWords(th); if (!d || !d.lessons[n - 1]) return W.go('#/t/' + th);
    const T = THEMES[th];
    const words = d.lessons[n - 1]; const play = words.filter((w) => w.t);
    const id = lessonId(th, n); const st = W.lessonState(id);
    W.setLast(th, { href: '#/t/' + th + '/l/' + n, label: t('lessonN', { n }), sub: [...new Set(words.map((w) => w.group))].slice(0, 2).join(' · ') });
    const pane = h('div');
    const page = h('div.page', null, appbar({ back: '#/t/' + th, title: t('lessonN', { n }), sub: t('wordsN', { n: words.length }) + ' · ' + t(T.key) }), segCtl(0, (k) => draw(k), T.color), pane);
    const pool = d.playable;
    const launch = (g) => W.playGame({ game: g, lessonId: id, words: play, pool: [...play, ...pool.filter((x) => !play.includes(x))].slice(0, 120), onDone: () => draw(0) });
    const draw = (k) => {
      const box = h('div.tabpane');
      if (k === 0) {
        box.append(h('div.games', null, ['flash', 'pairs', 'trans', 'hear'].map((g) => gameCard(g, st.games[g], () => launch(g)))), examWidget(st, () => launch('exam')));
      } else {
        box.append(h('p.muted.small', { style: { textAlign: 'center', margin: '0 0 8px' } }, t('list_tip')));
        const list = h('div.wlist'); let g = null;
        words.forEach((w) => {
          if (w.group && w.group !== g) { g = w.group; list.append(h('div.wgroup', null, g)); }
          list.append(h('div.card.wrow', { on: { click: () => W.say(w.ar, w.audio) }, style: { cursor: 'pointer' } },
            W.sayBtn(w.ar, w.audio),
            h('div.tr', null, h('b', null, w.t || '—', w.tag ? h('span.tag', null, t('tags')[w.tag] || w.tag) : null, w.cat ? h('span.tag', null, w.cat) : null), w.note ? h('span', null, w.note) : null),
            h('div.arw', { lang: 'ar', dir: 'rtl' }, ar(w.ar), w.extra && !w.forms ? h('small', { dir: 'rtl' }, w.extra) : null)));
          if (w.forms) list.lastChild.after(formsGrid(w));
        });
        box.append(list);
      }
      pane.replaceChildren(box);
    };
    draw(0);
    W.mount(page, tok);
  });

  W.route(/^\/t\/(w85)\/conj$/, async (tok, th) => {
    const d = await W.load(THEMES[th].data); if (!d || !d.conjugation) return W.go('#/t/' + th);
    const page = h('div.page', null, appbar({ back: '#/t/' + th, title: W.lang === 'en' ? 'Conjugation tables' : 'Tableaux de conjugaison', sub: t(THEMES[th].key) }));
    d.conjugation.forEach((pg) => {
      const card = h('div.card.conj', null, h('h3', null, h('span.ar', { lang: 'ar' }, pg.title_ar), ' ', h('span.muted', null, (W.lang === 'en' ? pg.title_en : pg.title_fr) || pg.title_en)));
      const cols = h('div.conjcols');
      (pg.columns || []).forEach((c) => cols.append(h('div.conjcol', null, h('div.ch', null, h('span.ar', { lang: 'ar' }, c.head_ar || ''), h('small', null, (W.lang === 'en' ? c.head_en : c.head_fr) || c.head_en || '')),
        (c.rows || []).map((r) => h('button.conjrow', { on: { click: () => W.say(r.ar, null) } }, h('span.ar', { lang: 'ar' }, r.ar), h('small', null, r[L()] || r.en))))));
      card.append(cols);
      const fr = pg.footer_rows || []; if (fr.length) card.append(h('div.conjfoot', null, pg.footer_label ? h('small.muted', null, pg.footer_label[L()] || pg.footer_label.en || '') : null, fr.map((r) => h('button.conjrow', { on: { click: () => W.say(r.ar, null) } }, h('span.ar', { lang: 'ar' }, r.ar), h('small', null, r[L()] || r.en)))));
      page.append(card);
    });
    W.mount(page, tok);
  });

  /* ---------- reading: the book, page by page ---------- */
  const isRead = (n) => !!(S.readPages && S.readPages[n]);
  /* Apprendre à lire — sommaire en parcours (modèle P3) */
  const RR_KEY = 'wakf.recentRead';
  const recentRead = () => { try { return JSON.parse(localStorage.getItem(RR_KEY) || '[]'); } catch (e) { return []; } };
  const pushRecentRead = (pg) => { try { const r = recentRead().filter((x) => x.p !== pg); r.unshift({ p: pg, t: Date.now() }); localStorage.setItem(RR_KEY, JSON.stringify(r.slice(0, 8))); } catch (e) {} };
  const RD_TXT = { 70: ['L’élève bien élevé', 'The well-mannered pupil'], 71: ['À l’école', 'At school'], 72: ['Le retour de l’école', 'Coming home from school'], 73: ['Fatima, une fille bien élevée', 'Fatima, a well-mannered girl'], 74: ['La pleine lune s’est levée', 'The full moon has risen'], 75: ['Le temps', 'Time'], 76: ['La prière, pilier de la religion', 'Prayer, the pillar of religion'], 77: ['Le mois de Ramadan', 'The month of Ramadan'], 78: ['Le jeu', 'Play'], 79: ['Je suis musulman', 'I am a Muslim'], 80: ['Les vacances d’été', 'The summer holidays'], 81: ['La propreté', 'Cleanliness'], 82: ['Les ablutions', 'Ablution'], 83: ['Le paysan', 'The farmer'], 84: ['La lune', 'The moon'], 85: ['Dialogue entre Rachid et Fatima', 'A dialogue between Rachid and Fatima'], 86: ['L’organisation du temps', 'Organising one’s time'], 87: ['La sauterelle et la fourmi', 'The grasshopper and the ant'], 88: ['L’amour des parents', 'Love for one’s parents'], 89: ['Le musulman est le frère du musulman', 'A Muslim is a Muslim’s brother'], 90: ['L’adieu', 'Farewell'] };
  const RD_BASE = [['Les voyelles et les signes', 'Vowels and signs'], ['Les 28 lettres', 'The 28 letters'], ['Début, milieu, fin de mot', 'Start, middle, end of a word']];
  const RD_IC = (k) => {
    const c = 'currentColor', T = (x, y, s, v, o = '') => `<text x="${x}" y="${y}" font-family="Amiri,serif" font-weight="700" font-size="${s}" text-anchor="middle" fill="${c}"${o}>${v}</text>`;
    const box = (b) => `<svg class="rdi" viewBox="0 0 48 48" aria-hidden="true">${b}</svg>`;
    return box({
      signes: `<circle cx="24" cy="25" r="9.5" fill="none" stroke="${c}" stroke-width="2.8" stroke-dasharray="3.4 3.2"/><path d="M17 10.5l12-4M19 43l12-4" stroke="${c}" stroke-width="3.8" stroke-linecap="round"/><circle cx="38.5" cy="11" r="4" fill="none" stroke="${c}" stroke-width="2.8"/>`,
      alphabet: `<rect x="3" y="3" width="42" height="42" rx="11" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M24 3v42M3 24h42" stroke="${c}" stroke-width="2" opacity=".45"/>${T(34.5, 19.5, 15, 'أ')}${T(13.5, 19.5, 15, 'ب')}${T(34.5, 40, 15, 'ت')}${T(13.5, 40, 15, 'ث')}`,
      formes: `${T(38, 22, 15, 'ع')}${T(13, 22, 15, 'عـ')}${T(36, 42, 15, 'ـعـ')}${T(12, 42, 15, 'ـع')}<path d="M24 4v40M4 26h40" stroke="${c}" stroke-width="2" stroke-linecap="round" opacity=".35"/>`,
      dua: `<circle cx="24" cy="21" r="14" fill="none" stroke="${c}" stroke-dasharray=".1 5.6" stroke-linecap="round" style="stroke-width:5"/><path d="M24 35v6" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><path d="M20 41h8l-4 5z" fill="${c}"/><path d="M29 15a7 7 0 1 0 0 12 5.5 5.5 0 1 1 0-12z" fill="${c}"/>`,
    }[k]);
  };
  W.route(/^\/t\/read$/, async (tok) => {
    const en = W.lang === 'en'; const tl = (a, b) => (en ? b : a);
    const book = await W.load('reading'); if (!book) return;
    const pages = W.bookPages(book); const by = {}; pages.forEach((p) => (by[p.page] = p));
    const secs = W.bookSections(book);
    const items = secs.flatMap((s) => s.items);
    const done = (it) => isRead(it.page) && (!it.writing || isRead(it.writing));
    const lastPg = S.last.read && S.last.read.page;
    const curIt = (lastPg && items.find((it) => it.page === lastPg || it.writing === lastPg)) || items.find((it) => !done(it)) || items[0];
    const lessonsAll = items.filter((it) => by[it.page].kind === 'lesson');
    const nLesDone = lessonsAll.filter(done).length;
    const page = h('div.page.rdl', null, appbar({ back: '#/', title: t('th_read') }), h('h1.sl-big', null, tl('Leçons', 'Lessons')));
    const lblOf = (it) => { const p = by[it.page]; return p.kind === 'lesson' ? tl('Leçon ', 'Lesson ') + p.lesson : RD_TXT[it.page] ? RD_TXT[it.page][en ? 1 : 0] : it.label; };
    const curP = by[curIt.page];
    page.append(h('a.resume', { href: '#/t/read/p/' + (lastPg || curIt.page), style: { '--c': cvar('amethyste'), '--cd': cvar('amethyste', 'd') } },
      h('span.pl' + (curIt.glyph ? '.rd-g' : ''), curIt.glyph ? null : { html: svg('read') }, curIt.glyph ? curIt.glyph : null),
      h('span', null, h('small', null, lastPg ? t('resume') : t('ctaStart')), h('b', null, lblOf(curIt)),
        h('span.s', null, tl(nLesDone + ' leçon' + (nLesDone > 1 ? 's' : '') + ' terminée' + (nLesDone > 1 ? 's' : '') + ' sur ' + lessonsAll.length, nLesDone + ' of ' + lessonsAll.length + ' lessons completed')),
        h('span.rd-bar', null, h('i', { style: { width: Math.round((nLesDone / lessonsAll.length) * 100) + '%' } }))),
      h('span.go', { html: svg('next') })));
    // pages récentes
    const ago = (ts) => { const d = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 864e5); return en ? (d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago') : (d <= 0 ? 'aujourd’hui' : d === 1 ? 'hier' : 'il y a ' + d + ' jours'); };
    const rec = []; recentRead().forEach((r) => { const it = items.find((x) => x.page === r.p || x.writing === r.p); if (it && !rec.some((y) => y.it === it)) rec.push({ it, t: r.t }); });
    const nodeIcon = (it, i) => { const p = by[it.page]; if (p.kind === 'lesson') return { txt: it.glyph }; if (it.page <= 7) return { html: RD_IC(['signes', 'alphabet', 'formes'][i] || 'formes') }; if (it.page === 93) return { html: RD_IC('dua') }; return { html: svg('read') }; };
    if (rec.length) {
      page.append(h('section.sl-recent', null, h('h2', null, h('span.sl-clock', { 'aria-hidden': 'true' }), tl('Pages récentes', 'Recent pages') + ' (' + rec.length + ')'),
        h('div.sl-pills', null, rec.map(({ it, t: ts }) => { const ic = nodeIcon(it, secs[0].items.indexOf(it)); return h('a.sl-pill', { href: '#/t/read/p/' + it.page },
          h('span.n.rd-pn' + (ic.txt ? '.ar' : ''), ic.html ? { html: ic.html } : null, ic.txt || null), h('span', null, h('b', null, lblOf(it)), h('small', null, ago(ts)))); }))));
    }
    const headOf = (title, list) => h('div.rd-sec', null, h('h2', null, title), h('span.rd-cnt', null, list.filter(done).length + '/' + list.length));
    const status = (it) => done(it) ? h('span.rd-ck', { html: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="var(--jade)"/><path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' }) : it === curIt ? h('span.rd-now', null, tl('En cours', 'In progress')) : null;
    const stepEl = (it, node, title, sub) => h('a.rd-step' + (done(it) ? '.d' : '') + (it === curIt ? '.c' : ''), { href: '#/t/read/p/' + it.page }, node, h('span.rd-box', null, h('span.t', null, h('b', null, title), sub ? h('small', null, sub) : null), status(it)));
    const kwSub = (p) => [h('span.ar.rd-kw', { lang: 'ar' }, p.keyword || ''), ' « ' + ((en ? p.image_alt_en : p.image_alt_fr) || '').split(' «')[0].split(' (')[0].replace(/ portant$| bearing$/, '') + ' »'];
    const T = [tl('Les bases', 'The basics'), tl('Partie 1 · Les 29 leçons', 'Part 1 · The 29 lessons'), tl('Partie 2 · Textes de lecture', 'Part 2 · Reading texts'), tl('Sourates et invocations', 'Surahs and invocations')];
    secs.forEach((sec, si) => {
      page.append(headOf(T[si] || sec.title, sec.items));
      const path = h('div.rd-path');
      sec.items.forEach((it, i) => {
        const p = by[it.page];
        if (si === 0) path.append(stepEl(it, h('span.rd-node.ic', { html: nodeIcon(it, i).html }), it.label, tl(...RD_BASE[i] || ['', ''])));
        else if (p.kind === 'lesson' && p.lesson === 1) {
          const d = done(it);
          path.append(h('a.rd-step.hero' + (d ? '.d' : '') + (it === curIt ? '.c' : ''), { href: '#/t/read/p/' + it.page }, h('span.rd-node.num.big', null, '1'),
            h('span.rd-hero', null, h('span.big1', { 'aria-hidden': 'true' }, '1'), h('small', null, it.label), h('b', null, tl('La lettre ', 'The letter '), h('span.ar.rd-kw', { lang: 'ar' }, it.glyph)), h('span.s', null, ...kwSub(p)),
              h('span.go', null, d ? '✓ ' + tl('Terminée · Revoir', 'Completed · Review') : tl('Commencer', 'Start')))));
        } else if (p.kind === 'lesson') path.append(stepEl(it, h('span.rd-node.num', null, String(p.lesson)), [tl('La lettre ', 'The letter '), h('span.ar.rd-kw', { lang: 'ar' }, it.glyph)], kwSub(p)));
        else if (si === 2) path.append(stepEl(it, h('span.rd-node.num.sq', null, String(i + 1)), h('span.ar.rd-at', { lang: 'ar' }, it.label), RD_TXT[it.page] ? RD_TXT[it.page][en ? 1 : 0] : ''));
      });
      if (si === 3) {
        const SUR = [[1, 'Al-Fatiha', 'L’ouverture', 'The Opener', 91], [112, 'Al-Ikhlas', 'Le monothéisme pur', 'Sincerity', 91], [113, 'Al-Falaq', 'L’aube naissante', 'The Daybreak', 92], [114, 'An-Nas', 'Les hommes', 'Mankind', 92]];
        const box = h('div.rd-sur');
        SUR.forEach(([n, nm, fr, enn, pg]) => { const it = sec.items.find((x) => x.page === pg); if (!it) return;
          box.append(h('a.rd-srow' + (done(it) ? '.d' : ''), { href: '#/t/read/p/' + pg }, h('span.t', null, h('b', null, n + '. ' + nm), h('small', null, en ? enn : fr)), h('span.sn', { 'aria-hidden': 'true', translate: 'no' }, String(n).padStart(3, '0')), status(it))); });
        const inv = sec.items.find((x) => x.page === 93);
        if (inv) box.append(h('a.rd-srow' + (done(inv) ? '.d' : ''), { href: '#/t/read/p/93' }, h('span.rd-node.ic.sm', { html: RD_IC('dua') }), h('span.t', null, h('b', null, tl('Invocations de la prière', 'Prayer invocations')), h('small', null, h('span.ar.rd-kw', { lang: 'ar' }, inv.label))), status(inv)));
        page.append(box);
      } else page.append(path);
    });
    W.mount(page, tok);
  });
  W.route(/^\/t\/read\/p\/(\d+)$/, async (tok, num) => {
    const book = await W.load('reading'); if (!book) return;
    const pages = W.bookPages(book); const i = pages.findIndex((p) => p.page === +num); if (i < 0) return W.go('#/t/read');
    const p = pages[i];
    // lesson context for the subtitle
    let ctx = p;
    if (p.kind === 'writing') ctx = pages[i - 1];
    const title = W.pageLabel(p) + (p.kind === 'writing' && ctx.kind === 'lesson' ? ' · ' + W.pageLabel(ctx) : '');
    W.setLast('read', { href: '#/t/read/p/' + p.page, page: p.page, label: W.pageLabel(ctx) }); pushRecentRead(p.page);
    const prev = pages[i - 1], next = pages[i + 1];
    const sentinel = h('div.sentinel');
    const readMark = h('div.readmark' + (isRead(p.page) ? '.on' : ''), { html: svg('pageRead') }, W.lang === 'en' ? 'Page read' : 'Page lue');
    const pager = h('nav.pager', { 'aria-label': W.lang === 'en' ? 'Pages' : 'Pages' },
      prev ? h('a.btn.outline.sm', { href: '#/t/read/p/' + prev.page, 'aria-label': (W.lang === 'en' ? 'Previous page' : 'Page précédente'), html: svg('back') }) : h('span.btn.outline.sm.off', { html: svg('back') }),
      h('a.pgn', { href: '#/t/read' }, h('span', { html: svg('toc') }), h('b', null, (i + 1) + ' / ' + pages.length)),
      next ? h('a.btn.amethyste.sm', { href: '#/t/read/p/' + next.page }, W.lang === 'en' ? 'Next' : 'Suivante', h('span', { html: svg('next'), style: { display: 'inline-flex' } })) : h('span.btn.sm.off', null, W.lang === 'en' ? 'Next' : 'Suivante'));
    const page = h('div.page.book', null, appbar({ back: '#/t/read', title, sub: t('page') + ' ' + p.page + ' · ' + t('th_read') }), W.renderBookPage(p), readMark, sentinel);
    if (!W.mount(page, tok)) return;
    W.$('#view').append(pager);
    // a page counts as read once scrolled to the bottom
    const io = new IntersectionObserver((es) => {
      if (es.some((e) => e.isIntersecting)) {
        S.readPages = S.readPages || {}; if (!S.readPages[p.page]) { S.readPages[p.page] = Date.now(); W.save(); readMark.classList.add('on'); }
        io.disconnect();
      }
    }, { threshold: 1 });
    setTimeout(() => io.observe(sentinel), 1500);
    const onKey = (e) => { if (!document.body.contains(page)) return document.removeEventListener('keydown', onKey); if (e.target.tagName === 'INPUT') return; if (e.key === 'ArrowLeft' && prev) W.go('#/t/read/p/' + prev.page); if (e.key === 'ArrowRight' && next) W.go('#/t/read/p/' + next.page); };
    document.addEventListener('keydown', onKey);
  });

  /* ---------- surahs ---------- */
  const RS_KEY = 'wakf.recentSurahs';
  const recentSurahs = () => { try { return JSON.parse(localStorage.getItem(RS_KEY) || '[]'); } catch (e) { return []; } };
  const pushRecentSurah = (n) => { try { const r = recentSurahs().filter((x) => x.n !== n); r.unshift({ n, t: Date.now() }); localStorage.setItem(RS_KEY, JSON.stringify(r.slice(0, 8))); } catch (e) {} };
  const ago = (ts) => {
    const d = Math.floor((new Date().setHours(0, 0, 0, 0) - new Date(ts).setHours(0, 0, 0, 0)) / 864e5);
    if (W.lang === 'en') return d <= 0 ? 'today' : d === 1 ? 'yesterday' : d + ' days ago';
    return d <= 0 ? 'aujourd’hui' : d === 1 ? 'hier' : 'il y a ' + d + ' jours';
  };
  const snGlyph = (n) => h('span.sn', { translate: 'no', 'aria-hidden': 'true' }, String(n).padStart(3, '0'));
  W.route(/^\/t\/surah$/, async (tok) => {
    const en = W.lang === 'en';
    const list = (await W.load('surahlist')) || [];
    const page = h('div.page.slist', null, appbar({ back: '#/', title: t('th_surah') }), h('h1.sl-big', null, en ? 'Surahs' : 'Sourates'));
    const byN = {}; list.forEach((x) => (byN[x[0]] = x));
    const rec = recentSurahs().filter((r) => byN[r.n]);
    if (rec.length) {
      page.append(h('section.sl-recent', null,
        h('h2', null, h('span.sl-clock', { 'aria-hidden': 'true' }), (en ? 'Recent pages' : 'Pages récentes') + ' (' + rec.length + ')'),
        h('div.sl-pills', null, rec.map((r) => h('a.sl-pill', { href: '#/mm/' + r.n },
          h('span.n', null, String(r.n)), h('span', null, h('b', null, byN[r.n][1].toUpperCase()), h('small', null, ago(r.t))))))));
    }
    let cur = 0, grp = null;
    for (const x of list) {
      const [n, name, trFr, trEn, place, verses, juz, themes] = x;
      if (juz !== cur) {
        cur = juz; grp = h('div.sl-grp'); const g = grp;
        const head = h('button.sl-juz', { 'aria-expanded': 'true' }, h('span', null, 'Juz’ ' + juz), h('span.chev', { html: svg('next') }));
        head.addEventListener('click', () => { const open = head.getAttribute('aria-expanded') !== 'true'; head.setAttribute('aria-expanded', String(open)); g.hidden = !open; });
        page.append(head, grp);
      }
      const meta = [en ? trEn : trFr, place === 'Md' ? (en ? 'Medinan' : 'Médinoise') : (en ? 'Meccan' : 'Mecquoise'), verses + ' ' + (en ? 'verses' : 'versets')].filter((v, i) => v && !(i === 0 && v === name)).join(' · ');
      grp.append(h('a.sl-row', { href: '#/mm/' + n },
        h('span.sl-t', null, h('span.sl-nm', null, h('span', null, n + '. ' + name), snGlyph(n)), h('span.sl-sub', null, meta)),
        h('span.sl-th', null, h('b', null, String(themes)), h('small', null, en ? 'themes' : 'thèmes'))));
    }
    W.mount(page, tok);
  });
  W.route(/^\/mm\/(\d+)$/, async (tok, n) => {
    const s = SURAHS.find((x) => x.n === +n); if (!s) return W.go('#/t/surah');
    const d = await W.load(s.data); if (!d) return;
    if (!d._prep) d._prep = await W.mmPrepare(d);
    if (!d._prep) { d._prep = null; return W.mount(h('div.page', null, appbar({ back: '#/t/surah', title: d.surah['name_' + L()] || d.surah.name_en }), emptyState('surah', t('surahsTitle'), W.lang === 'en' ? 'Connect to the internet once to load this surah.' : 'Connecte-toi une première fois à Internet pour charger cette sourate.')), tok); }
    W.markOpened('surah:' + s.n); pushRecentSurah(s.n);
    const name = d.surah['name_' + L()] || d.surah.name_en;
    W.setLast('surah', { href: '#/mm/' + n, label: name.split(' (')[0], sub: t('surahN', { n }) });
    let tab = 'visual'; try { tab = sessionStorage.getItem('wakf.mmtab') || 'visual'; } catch (e) {}
    W.mount(h('div.page.wide', null, appbar({ back: '#/t/surah', title: name, sub: t('surahN', { n }) }), W.renderMindmap(d, tab)), tok);
  });

  /* ---------- review ---------- */
  W.route(/^\/review$/, async (tok) => {
    const page = h('div.page', null, appbar({}));
    const words = await allWords(); const byId = {}; words.forEach((w) => (byId[w.id] = w));
    const now = Date.now();
    const due = W.dueIds().map((id) => byId[id]).filter((w) => w && w.t);
    const later = Object.keys(S.srs).filter((id) => S.srs[id].due > now && byId[id]).length;
    page.append(h('h1', { style: { margin: '6px 2px 14px' } }, t('reviewTitle')));
    if (!due.length) {
      page.append(emptyState('review', t('reviewEmpty'), t('reviewEmptySub')));
      if (later) page.append(h('p.muted', { style: { textAlign: 'center' } }, t('reviewSoon', { n: later })));
    } else {
      page.append(h('div.hero2', null, h('span.hi', { html: svg('review') }), h('div', null, h('b', null, String(due.length)), h('span', null, t('reviewDue')))));
      const byTh = {}; due.forEach((w) => (byTh[w.th] = (byTh[w.th] || 0) + 1));
      page.append(h('div.stack', null, Object.keys(byTh).map((th) => { const T = THEMES[th]; return h('div.card.rrow', { style: { '--c': cvar(T.color), '--l': cvar(T.color, 'l') } }, h('span.ri', { html: svg(T.icon) }), h('span.grow', null, h('b', null, t(T.key))), h('span.n', null, String(byTh[th]))); })));
      const list = due.slice(0, 20);
      const pool = words.filter((w) => w.t).slice(0, 400);
      page.append(h('div', { style: { marginTop: '18px' } }, h('button.btn.block', { html: svg('flash'), on: { click: () => W.playGame({ game: 'flash', words: list, pool, onDone: () => W.render() }) } }, t(list.length === 1 ? 'reviewStart1' : 'reviewStart', { n: list.length }))));
      if (later) page.append(h('p.muted.small', { style: { textAlign: 'center', marginTop: '14px' } }, t('reviewSoon', { n: later })));
    }
    W.mount(page, tok);
  });

  /* ---------- lexicon ---------- */
  const normAr = (s) => String(s || '').replace(/[ً-ٰٟۖ-ۭـ+]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').trim();
  const normLat = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, "'");
  W.route(/^\/lexicon$/, async (tok) => {
    const input = h('input', { type: 'search', placeholder: t('lexPh'), 'aria-label': t('lexTitle'), autocomplete: 'off', enterkeyhint: 'search' });
    const out = h('div.stack');
    const sugg = h('div.sugg');
    const page = h('div.page', null, appbar({}), h('h1', { style: { margin: '6px 2px 14px' } }, t('lexTitle')), h('div.search', null, h('span', { html: svg('search') }), input), sugg, out);
    if (!W.mount(page, tok)) return;
    const words = (await allWords()).map((w) => Object.assign(w, { _a: normAr(w.ar + ' ' + w.extra), _l: normLat(w.t + ' ' + w.note) }));
    const row = (w) => { const T = THEMES[w.th]; return h('div.card.wrow.lexrow', { style: { '--c': cvar(T.color, 'd'), '--l': cvar(T.color, 'l') } }, W.sayBtn(w.ar, w.audio),
      h('div.tr', null, h('b', null, w.t || '—'), h('a.src', { href: '#/t/' + w.th + '/l/' + w.lesson, html: svg(T.icon) }, t('inLesson', { r: t('short_' + w.th), n: w.lesson }))),
      h('div.arw', { lang: 'ar', dir: 'rtl' }, ar(w.ar))); };
    const run = () => {
      const q = input.value.trim();
      sugg.classList.toggle('hidden', !!q);
      if (!q) { out.replaceChildren(h('p.muted', { style: { margin: '4px 2px' } }, t('lexHint'))); return; }
      const isAr = /[؀-ۿ]/.test(q); const nq = isAr ? normAr(q) : normLat(q);
      const res = words.filter((w) => (isAr ? w._a.includes(nq) : w._l.includes(nq)));
      res.sort((a, b) => { const ka = isAr ? normAr(a.ar) === nq : normLat(a.t).split(/[;,]/).some((x) => x.trim() === nq); const kb = isAr ? normAr(b.ar) === nq : normLat(b.t).split(/[;,]/).some((x) => x.trim() === nq); return (kb - ka) || a.n - b.n; });
      out.replaceChildren(res.length ? h('p.muted.small', { style: { margin: '0 2px' } }, t(res.length === 1 ? 'lexCount1' : 'lexCount', { n: res.length })) : h('div.card.empty', null, h('div.ei', { html: svg('search') }), h('p', null, t('lexNone', { q }))), ...res.slice(0, 60).map(row));
    };
    const ex = W.pick(words.filter((w) => w.t && w.t.length < 14), 4);
    sugg.append(h('span.muted.small', { style: { alignSelf: 'center' } }, t('lexTry')), ...ex.map((w, i) => h('button', { on: { click: () => { input.value = i % 2 ? w.ar : w.t.split(/[;,]/)[0]; run(); } } }, i % 2 ? ar(w.ar) : w.t.split(/[;,]/)[0])));
    let tm; input.addEventListener('input', () => { clearTimeout(tm); tm = setTimeout(run, 120); });
    run();
    if (matchMedia('(min-width: 900px)').matches) input.focus();
  });

  W.route(/^\/profile$/, () => W.go('#/'));

  /* ---------- demo mode (institute PC): every new visitor starts from zero ---------- */
  var DEMO_KEY = 'wakf.demo';
  function isDemo() { try { return localStorage.getItem('wakf.demo') === '1'; } catch (e) { return false; } }
  W.isDemo = isDemo;
  function newVisitor() { W.resetAll(); W.lang = S.lang = null; W.save(); try { sessionStorage.clear(); for (const k of Object.keys(localStorage)) if (k.startsWith('wakf.norules.')) localStorage.removeItem(k); } catch (e) {} document.querySelectorAll('.player,.scrim').forEach((x) => x.remove()); document.body.style.overflow = ''; location.hash = '#/lang'; W.render(); }
  W.newVisitor = newVisitor;
  if (isDemo()) {
    // a fresh page load on the demo PC = a new visitor
    try { if (!sessionStorage.getItem('wakf.demo.session')) { sessionStorage.setItem('wakf.demo.session', '1'); W.resetAll(); W.lang = S.lang = null; W.save(); } } catch (e) {}
    let idle;
    const IDLE = 3 * 60 * 1000;
    const arm = () => { clearTimeout(idle); idle = setTimeout(async () => {
      if (!W.lang) return arm();
      const ok = await Promise.race([W.dialog({ title: W.lang === 'en' ? 'New visitor?' : 'Nouveau visiteur ?', text: W.lang === 'en' ? 'Without activity, the site will restart from zero in 15 seconds.' : 'Sans activité, le site repart de zéro dans 15 secondes.', icon: 'demo', ok: W.lang === 'en' ? 'Restart now' : 'Repartir de zéro', cancel: W.lang === 'en' ? 'I’m still here' : 'Je continue' }), new Promise((r) => setTimeout(() => r('timeout'), 15000))]);
      if (ok === true || ok === 'timeout') newVisitor(); else arm();
    }, IDLE); };
    ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach((ev) => addEventListener(ev, arm, { passive: true }));
    arm();
  }

  /* ---------- new version available ---------- */
  const showUpdate = (worker) => {
    if (document.querySelector('.update')) return;
    const bar = h('div.update', { role: 'status' }, h('span', { html: svg('reload') }), h('span.grow', null, W.lang === 'en' ? 'New version available' : 'Nouvelle version disponible'),
      h('button.btn.sm', { on: { click: () => { worker.postMessage({ type: 'skip' }); bar.remove(); } } }, W.lang === 'en' ? 'Reload' : 'Recharger'));
    document.body.append(bar);
  };
  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then((reg) => {
      const watch = (w) => w && w.addEventListener('statechange', () => { if (w.state === 'installed' && navigator.serviceWorker.controller) showUpdate(w); });
      if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
      reg.addEventListener('updatefound', () => watch(reg.installing));
      setInterval(() => reg.update().catch(() => {}), 30 * 60 * 1000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') reg.update().catch(() => {}); });
    }).catch(() => {});
    let reloaded = false; const hadCtl = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => { if (hadCtl && !reloaded) { reloaded = true; location.reload(); } });
  });
  /* ---------- boot ---------- */
  W.lang = S.lang;
  if (W.lang) document.documentElement.lang = W.lang;
  window.addEventListener('hashchange', () => {
    if (!W.lang && location.hash !== '#/lang') { location.replace('#/lang'); return; }
    W.render();
  });
  if (!W.lang) location.replace('#/lang');
  W.render();
})();
