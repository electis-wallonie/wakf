/* Wakf — views & routes */
(function () {
  'use strict';
  const { h, t, ar, icon } = W;
  const S = W.state;
  const L = () => (W.lang === 'en' ? 'en' : 'fr');

  /* ---------- themes config ---------- */
  const THEMES = {
    surah: { cls: 't-surah', key: 'th_surah', art: 'الرَّحْمٰن', emoji: '🕌', color: 'var(--teal)', dark: 'var(--teal-d)' },
    w85: { cls: 't-w85', key: 'th_w85', art: '٨٥٪', emoji: '📗', color: 'var(--green)', dark: 'var(--green-d)', data: 'words85', size: 20 },
    read: { cls: 't-read', key: 'th_read', art: 'أ ب ت', emoji: '✏️', color: 'var(--pink)', dark: 'var(--pink-d)', data: 'reading' },
    w1000: { cls: 't-w1000', key: 'th_w1000', art: '١٠٠٠', emoji: '📙', color: 'var(--orange)', dark: 'var(--orange-d)', data: 'words1000', size: 20 },
  };
  const ORDER = ['surah', 'w85', 'read', 'w1000'];

  /* ---------- word data normalisation ---------- */
  const wordsCache = {};
  const getWords = async (th) => {
    const key = th + ':' + L();
    if (wordsCache[key]) return wordsCache[key];
    const d = await W.load(THEMES[th].data);
    if (!d || !d.words || !d.words.length) return (wordsCache[key] = null);
    const items = d.words.map((w) => ({
      id: th + '-' + w.n, n: w.n, ar: w.ar, t: (L() === 'en' ? w.en : w.fr) || w.en || '',
      extra: w.extra_ar || '', tag: w.tag || '', note: (L() === 'en' ? w.note_en : w.note_fr) || '',
      group: (L() === 'en' ? w.group_en : w.group_fr) || w.group_en || '',
    }));
    const size = THEMES[th].size;
    const lessons = [];
    for (let i = 0; i < items.length; i += size) lessons.push(items.slice(i, i + size));
    return (wordsCache[key] = { items, lessons, playable: items.filter((w) => w.t), src: d });
  };
  const lessonId = (th, n) => th + '-L' + n;
  const lessonDone = (id) => (S.lessons[id] && S.lessons[id].exam >= 80);
  const themeProgress = async (th) => {
    if (th === 'surah') return null;
    if (th === 'read') { const b = await W.load('reading'); if (!b) return 0; const ns = W.readingNodes(b); return ns.filter((n) => Object.keys((S.lessons[n.id] || {}).games || {}).length).length / ns.length; }
    const d = await getWords(th); if (!d) return null;
    return d.lessons.filter((_, i) => lessonDone(lessonId(th, i + 1))).length / d.lessons.length;
  };

  /* ---------- nav ---------- */
  const NAV = [['#/', '🏠', 'home'], ['#/t/surah', '🕌', 'th_surah'], ['#/t/w85', '📗', 'th_w85'], ['#/t/read', '✏️', 'th_read'], ['#/t/w1000', '📙', 'th_w1000'], ['#/profile', '👤', 'profile']];
  const SHORT = { fr: { th_surah: 'Sourates', th_w85: '85 %', th_read: 'Lire', th_w1000: '1000', home: 'Accueil', profile: 'Profil' }, en: { th_surah: 'Surahs', th_w85: '85%', th_read: 'Read', th_w1000: '1000', home: 'Home', profile: 'Profile' } };
  let tabbar;
  W.updateNav = () => {
    const rail = W.$('#rail'); const hash = location.hash || '#/';
    const on = (href) => (href === '#/' ? hash === '#/' || hash === '#' : hash.startsWith(href));
    if (!W.lang || hash.startsWith('#/lang')) { rail.replaceChildren(); tabbar && tabbar.remove(); tabbar = null; return; }
    rail.replaceChildren(h('div.brand', { html: icon.logo + '<span>wakf</span>' }),
      ...NAV.map(([href, e, k]) => h('a' + (on(href) ? '.on' : ''), { href }, h('span.ic', null, e), t(k))));
    if (!tabbar) { tabbar = h('nav.tabbar', { 'aria-label': 'Navigation' }); document.body.append(tabbar); }
    tabbar.replaceChildren(...NAV.map(([href, e, k]) => h('a' + (on(href) ? '.on' : ''), { href }, h('span.ic', null, e), SHORT[L()][k])));
  };

  const topStats = () => h('div.stats', null, h('span.stat.fire', { title: t('streak') }, '🔥 ' + W.streakN()), h('span.stat.xp', { title: 'XP' }, '⚡ ' + S.xp));
  const backBar = (href, title, sub, extra) => h('div.topbar', null,
    h('a.iconbtn', { href, 'aria-label': 'back', html: icon.back }),
    h('div.grow', null, h('h2', null, title), sub ? h('div.muted.small', null, sub) : null), extra || topStats());

  /* ---------- language picker ---------- */
  const flagFR = '<svg viewBox="0 0 3 2"><rect width="1" height="2" fill="#002654"/><rect x="1" width="1" height="2" fill="#fff"/><rect x="2" width="1" height="2" fill="#ce1126"/></svg>';
  const flagUK = '<svg viewBox="0 0 60 40"><clipPath id="uk"><rect width="60" height="40"/></clipPath><g clip-path="url(#uk)"><rect width="60" height="40" fill="#012169"/><path d="M0 0l60 40M60 0L0 40" stroke="#fff" stroke-width="8"/><path d="M0 0l60 40M60 0L0 40" stroke="#c8102e" stroke-width="3"/><path d="M30 0v40M0 20h60" stroke="#fff" stroke-width="12"/><path d="M30 0v40M0 20h60" stroke="#c8102e" stroke-width="7"/></g></svg>';
  W.route(/^\/lang$/, () => {
    const pickLang = (l) => { W.lang = S.lang = l; W.save(); document.documentElement.lang = l; for (const k in wordsCache) delete wordsCache[k]; W.go('#/'); };
    W.mount(h('div.lang', null,
      h('div.hero', { html: icon.logo }),
      h('div', null, h('div.brand', { style: { justifyContent: 'center', fontSize: '40px' } }, 'wakf'), h('div.ar.big', { lang: 'ar' }, 'تَعَلَّمِ الْعَرَبِيَّةَ')),
      h('div', null, h('h1', null, 'Choisis ta langue · Choose your language')),
      h('div.choices', null,
        h('button.langbtn', { on: { click: () => pickLang('fr') } }, h('span.flag', { html: flagFR }), h('span', null, 'Français', h('small', null, 'Tout le site en français'))),
        h('button.langbtn', { on: { click: () => pickLang('en') } }, h('span.flag', { html: flagUK }), h('span', null, 'English', h('small', null, 'The whole site in English'))))));
  });

  /* ---------- home ---------- */
  W.route(/^\/$/, async () => {
    const goal = 30, dx = W.dailyXP();
    const fill = h('i'); const page = h('div.page');
    page.append(
      h('div.hello', null, h('div.brand', { html: icon.logo + '<span>wakf</span>', style: { fontSize: '26px' } }), topStats()),
      h('h1', null, t('hello')), h('p.muted', { style: { margin: '4px 0 16px' } }, t('homeSub')),
      h('div.card.daily', null, h('span', { style: { fontSize: '30px' } }, '🎯'), h('div.bar', null, h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } }, h('b', null, t('dailyGoal')), h('span.muted', null, Math.min(dx, goal) + ' / ' + goal + ' XP')), h('div.meter', null, fill))));
    const grid = h('div.themes');
    const bars = {};
    ORDER.forEach((k) => {
      const T = THEMES[k]; const pb = h('i');
      bars[k] = { pb, badge: h('span.badge.hidden', null, t('soon')) };
      grid.append(h('a.theme.' + T.cls, { href: '#/t/' + k }, h('span.art', { lang: 'ar' }, T.art), h('div', { style: { fontSize: '30px' } }, T.emoji), h('h2', null, t(T.key)), h('p', null, t(T.key + '_d')),
        h('div.foot', null, h('div.pbar', null, pb), bars[k].badge)));
    });
    page.append(grid, h('p.foot-note', null, t('sourcesText')));
    W.mount(page);
    requestAnimationFrame(() => (fill.style.width = Math.min(100, (dx / goal) * 100) + '%'));
    for (const k of ORDER) {
      const p = await themeProgress(k);
      if (p == null && k !== 'surah') bars[k].badge.classList.remove('hidden');
      bars[k].pb.style.width = (p || 0) * 100 + '%';
      if (k === 'surah') bars[k].pb.parentNode.style.visibility = 'hidden';
    }
  });

  /* ---------- path helper ---------- */
  const zig = (i) => Math.round(Math.sin(i * 0.9) * 70) + 'px';
  const pathNode = ({ href, label, glyph, done, current, color, dark, i }) => {
    const n = h('a.node' + (done ? '.done' : '') + (current ? '.current' : ''), { href, style: { '--x': zig(i) }, 'data-start': t('start'), 'aria-label': label });
    const disc = h('span.disc', { style: done ? null : { '--c': color, '--cd': dark } }, done ? '👑' : (/[؀-ۿ]/.test(glyph) ? ar(glyph) : glyph));
    n.style.setProperty('--c-t', color);
    n.append(disc, h('span.lbl' + (/[؀-ۿ]/.test(label) ? '.ar' : ''), null, label));
    return n;
  };

  /* ---------- theme pages ---------- */
  W.route(/^\/t\/(w85|w1000)$/, async (th) => {
    const T = THEMES[th];
    const page = h('div.page', null, backBar('#/', t(T.key)));
    W.mount(page);
    const d = await getWords(th);
    if (!d) { page.append(h('div.card.empty', null, h('div.e', null, '⏳'), h('h2', null, t('notYet')), h('p', null, th === 'w1000' ? t('w1000_wait') : t('notYetSub')))); return; }
    const path = h('div.path');
    let cur = d.lessons.findIndex((_, i) => !lessonDone(lessonId(th, i + 1)));
    d.lessons.forEach((ls, i) => {
      if (i % 5 === 0) {
        const u = i / 5 + 1; const grp = [...new Set(d.lessons.slice(i, i + 5).flat().map((w) => w.group))].slice(0, 3).join(' · ');
        path.append(h('div.unit', { style: { '--c': T.color, '--cd': T.dark, width: '100%' } }, h('div.grow', null, h('small', null, t('unitOf') + ' ' + u), h('h2', null, t('lessonN', { n: i + 1 }) + ' – ' + Math.min(i + 5, d.lessons.length)), h('div.small', null, grp))));
      }
      path.append(pathNode({ href: '#/t/' + th + '/l/' + (i + 1), label: t('lessonN', { n: i + 1 }), glyph: String(i + 1), done: lessonDone(lessonId(th, i + 1)), current: i === cur, color: T.color, dark: T.dark, i }));
    });
    page.append(h('p.muted.small', { style: { textAlign: 'center' } }, d.items.length + ' ' + t('words') + ' · ' + d.lessons.length + ' ' + t('lessons')), path,
      h('p.foot-note', null, t('sources') + ' : ' + d.src.source));
    const c = page.querySelector('.node.current'); if (c && cur > 2) setTimeout(() => c.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
  });

  /* lesson (word themes) */
  const segCtl = (i, onSwitch) => {
    const seg = h('div.seg', { 'data-i': i, role: 'tablist' }, h('span.thumb'));
    [t('tabGame'), t('tabList')].forEach((lbl, k) => seg.append(h('button' + (k === i ? '.on' : ''), { role: 'tab', 'aria-selected': String(k === i), on: { click: () => { if (+seg.dataset.i === k) return; seg.dataset.i = k; seg.querySelectorAll('button').forEach((b, j) => { b.classList.toggle('on', j === k); b.setAttribute('aria-selected', String(j === k)); }); onSwitch(k); } } }, (k ? '📋 ' : '🎮 ') + lbl)));
    return seg;
  };
  const gameCard = (g, emoji, color, done, onClick, exam) => h('button.card.press.game' + (exam ? '.exam' : ''), { on: { click: onClick } },
    h('span.gi', { style: { '--c': color } }, emoji), h('span', null, h('h3', null, t('g_' + g)), h('p', null, t('g_' + g + '_d'))), done ? h('span.chk', null, exam ? '👑' : '✔') : null);
  const GCOL = { flash: 'var(--pink)', hear: 'var(--blue)', trans: 'var(--green)', pairs: 'var(--purple)', exam: 'var(--gold)', guided: 'var(--pink)', listen: 'var(--blue)', lpairs: 'var(--purple)', write: 'var(--orange)' };

  W.route(/^\/t\/(w85|w1000)\/l\/(\d+)$/, async (th, n) => {
    n = +n; const d = await getWords(th); if (!d || !d.lessons[n - 1]) return W.go('#/t/' + th);
    const words = d.lessons[n - 1]; const play = words.filter((w) => w.t);
    const id = lessonId(th, n); const st = W.lessonState(id);
    const tabKey = 'wakf.tab'; let tab = 0; try { tab = +(sessionStorage.getItem(tabKey + id) || 0); } catch (e) {}
    const pane = h('div');
    const page = h('div.page', null, backBar('#/t/' + th, t('lessonN', { n }), t('wordsN', { n: words.length }) + ' · ' + t(THEMES[th].key)), segCtl(tab, (k) => { try { sessionStorage.setItem(tabKey + id, k); } catch (e) {} draw(k); }), pane);
    // pool for distractors: whole list
    const pool = d.playable;
    const launch = (g) => W.playGame({ game: g, lessonId: id, words: play, pool: [...play, ...pool.filter((x) => !play.includes(x))].slice(0, 120), onDone: () => draw(0) });
    const draw = (k) => {
      const box = h('div.tabpane');
      if (k === 0) {
        box.append(h('div.games', null,
          ['flash', 'hear', 'trans', 'pairs'].map((g) => gameCard(g, W.gameMeta[g][0], GCOL[g], st.games[g], () => launch(g))),
          gameCard('exam', '👑', GCOL.exam, st.exam >= 80, () => launch('exam'), true)));
      } else {
        box.append(h('p.muted.small', { style: { textAlign: 'center', margin: '0 0 8px' } }, t('list_tip')));
        const list = h('div.wlist'); let g = null;
        words.forEach((w) => {
          if (w.group && w.group !== g) { g = w.group; list.append(h('div.wgroup', null, g)); }
          list.append(h('div.card.wrow', { on: { click: () => W.speak(w.ar, 'ar') }, style: { cursor: 'pointer' } },
            W.sayBtn(w.ar),
            h('div.tr', null, h('b', null, w.t || '—', w.tag ? h('span.tag', null, t('tags')[w.tag] || w.tag) : null), w.note ? h('span', null, w.note) : null),
            h('div.arw', { lang: 'ar', dir: 'rtl' }, ar(w.ar), w.extra ? h('small', { dir: 'rtl' }, w.extra) : null)));
        });
        box.append(list);
      }
      pane.replaceChildren(box);
    };
    draw(tab);
    W.mount(page);
  });

  /* ---------- reading theme ---------- */
  W.route(/^\/t\/read$/, async () => {
    const T = THEMES.read;
    const page = h('div.page', null, backBar('#/', t(T.key)));
    W.mount(page);
    const book = await W.load('reading'); if (!book) return;
    const nodes = W.readingNodes(book);
    const path = h('div.path');
    const started = (n) => Object.keys((S.lessons[n.id] || {}).games || {}).length > 0;
    const cur = nodes.findIndex((n) => !started(n));
    let unit = 0;
    nodes.forEach((n, i) => {
      if (n.unit !== unit) {
        unit = n.unit;
        const ttl = unit === 1 ? t('readPart1') : unit === 2 ? t('readPart2') : t('readSurahs');
        path.append(h('div.unit', { style: { '--c': T.color, '--cd': T.dark, width: '100%' } }, h('div.grow', null, h('small', null, t('unitOf') + ' ' + unit), h('h2', null, ttl))));
      }
      path.append(pathNode({ href: '#/t/read/l/' + n.id, label: n.label, glyph: n.glyph, done: started(n), current: i === cur, color: T.color, dark: T.dark, i }));
    });
    page.append(path, h('p.foot-note', null, t('sources') + ' : ' + book.source));
    const c = page.querySelector('.node.current'); if (c && cur > 2) setTimeout(() => c.scrollIntoView({ block: 'center', behavior: 'smooth' }), 250);
  });

  W.route(/^\/t\/read\/l\/([\w-]+)$/, async (nid) => {
    const book = await W.load('reading'); if (!book) return;
    const nodes = W.readingNodes(book); const node = nodes.find((n) => n.id === nid); if (!node) return W.go('#/t/read');
    const idx = nodes.indexOf(node); const st = W.lessonState(node.id);
    let tab = 0; try { tab = +(sessionStorage.getItem('wakf.tab' + nid) || 0); } catch (e) {}
    const pages = W.readingPagesOf(node);
    const sub = t('page') + ' ' + pages.map((p) => p.page).join(', ');
    const title = node.kind === 'lesson' ? (node.page['title_' + L()] || node.label) : node.label;
    const pane = h('div');
    const nav = h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '24px', gap: '12px' } },
      idx > 0 ? h('a.btn.outline', { href: '#/t/read/l/' + nodes[idx - 1].id }, '←') : h('span'),
      idx < nodes.length - 1 ? h('a.btn.ghost', { href: '#/t/read/l/' + nodes[idx + 1].id }, t('nextBlock') + ' →') : h('span'));
    const page = h('div.page', null, backBar('#/t/read', title, sub), segCtl(tab, (k) => { try { sessionStorage.setItem('wakf.tab' + nid, k); } catch (e) {} draw(k); }), pane, nav);
    const draw = (k) => {
      const box = h('div.tabpane');
      if (k === 0) {
        box.append(h('div.games', null, W.readingGames(node).map((g) => gameCard(g.id, W.gameMeta[g.id][0], GCOL[g.id], st.games[g.id], () =>
          W.playGame({ game: g.id, lessonId: node.id, words: [], runner: g.run, onDone: () => draw(0) })))));
      } else pages.forEach((p) => box.append(W.renderPage(p)));
      pane.replaceChildren(box);
    };
    draw(tab);
    W.mount(page);
  });

  /* ---------- surahs ---------- */
  const SURAHS = [{ n: 55, data: 'rahman' }];
  W.route(/^\/t\/surah$/, async () => {
    const page = h('div.page', null, backBar('#/', t('th_surah')));
    W.mount(page);
    for (const s of SURAHS) {
      const d = await W.load(s.data); if (!d) continue;
      const count = d.sections.length;
      page.append(h('a.card.press', { href: '#/mm/' + s.n, style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' } },
        h('span', { style: { width: '64px', height: '64px', borderRadius: '18px', background: 'var(--teal)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: '20px', boxShadow: '0 4px 0 var(--teal-d)', flex: 'none' } }, String(s.n)),
        h('span', { style: { flex: 1 } }, h('h3', null, d.surah['name_' + L()] || d.surah.name_en), h('span.muted.small', null, count + ' sections · ' + t('mmVisual') + ' & ' + t('mmMental'))),
        h('span.ar', { lang: 'ar', style: { fontSize: '34px' } }, d.surah.name_ar)));
    }
    page.append(h('div.card.empty', null, h('div.e', null, '🗺️'), h('p', null, t('mmSoon'))));
  });
  W.route(/^\/mm\/(\d+)$/, async (n) => {
    const s = SURAHS.find((x) => x.n === +n); if (!s) return W.go('#/t/surah');
    const d = await W.load(s.data); if (!d) return;
    let tab = 'visual'; try { tab = sessionStorage.getItem('wakf.mmtab') || 'visual'; } catch (e) {}
    W.mount(h('div.page.wide', null, backBar('#/t/surah', d.surah['name_' + L()] || d.surah.name_en, t('surahN', { n })), W.renderMindmap(d, tab),
      h('p.foot-note', null, t('sources') + ' : Mind map « Surah Ar-Rahman » (institut).')));
  });

  /* ---------- profile ---------- */
  let deferredInstall = null;
  window.addEventListener('beforeinstallprompt', (e) => { e.preventDefault(); deferredInstall = e; });
  W.route(/^\/profile$/, () => {
    const done = Object.values(S.lessons).filter((l) => l.exam >= 80).length;
    const kpi = (e, v, l) => h('div.card.kpi', null, h('span.e', null, e), h('div', null, h('b', null, String(v)), h('span', null, l)));
    const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
    const page = h('div.page', null,
      h('div.topbar', null, h('div.grow', null, h('h1', null, t('profile'))), topStats()),
      h('div.kpis', null, kpi('🔥', W.streakN(), t('streak')), kpi('⚡', S.xp, 'XP'), kpi('👑', done, t('lessonsDone')), kpi('🃏', S.seen || 0, t('wordsSeen'))),
      h('h2', { style: { margin: '26px 0 10px' } }, t('settings')),
      h('div.card', { style: { display: 'grid', gap: '12px' } },
        h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } }, h('span', null, t('language') + ' : ' + (W.lang === 'en' ? 'English' : 'Français')),
          h('a.btn.outline', { href: '#/lang', style: { minHeight: '42px' } }, t('changeLang'))),
        standalone ? h('div.muted', null, '✅ ' + t('installed')) : h('button.btn.blue.block', { on: { click: async () => {
          if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; }
          else W.toast(W.lang === 'en' ? 'iPhone: Share ⬆️ → “Add to Home Screen”. Android/PC: browser menu → “Install app”.' : 'iPhone : Partager ⬆️ → « Sur l’écran d’accueil ». Android/PC : menu du navigateur → « Installer l’application ».', 6000);
        } } }, '📲 ' + t('install')),
        h('button.btn.outline.block', { on: { click: () => { if (confirm(t('resetConfirm'))) { try { localStorage.setItem('wakf.v1', JSON.stringify({ lang: S.lang })); } catch (e) {} location.hash = '#/'; location.reload(); } } } }, t('resetProgress'))),
      h('h2', { style: { margin: '26px 0 10px' } }, t('sources')),
      h('div.card.small', { style: { lineHeight: 1.6 } },
        h('div', null, '📗 85% of Qur’anic Words — Dr. Abdulazeez Abdulraheem, Understand Al-Qur’an Academy'),
        h('div', null, '✏️ أتعلم العربية (Ataallam) — Mohammad Ayoub, Paris 1991'),
        h('div', null, '🕌 Mind map — Surah Ar-Rahman'),
        h('div.muted', { style: { marginTop: '8px' } }, t('sourcesText'))));
    W.mount(page);
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
  if ('serviceWorker' in navigator && location.protocol !== 'file:') addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
})();
