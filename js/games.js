/* Wakf — game engine: player shell + mini-games (flashcards, tap-what-you-hear, translation, pairs, exam, listen) */
(function () {
  'use strict';
  const { h, t, ar, shuffle, pick, icon } = W;

  /* ---------- word helpers ---------- */
  const tagLbl = (tag) => (tag ? (t('tags')[tag] || tag) : '');
  W.wordLabel = (w) => w.t + (w.tag ? ' (' + tagLbl(w.tag) + ')' : '') + (w.note ? ' — ' + w.note : '');
  const MARKS = /[ً-ٰٟۖ-ۭ]/;
  const cleanAr = (s) => String(s || '').replace(/\([^)]*\)/g, '').replace(/\+/g, '').replace(/\s+/g, ' ').trim();
  W.tilesFor = (s) => {
    s = cleanAr(s);
    if (!s || /[ـ…]/.test(s)) return null;
    if (s.includes(' ')) { const p = s.split(' '); return p.length >= 2 && p.length <= 6 ? p : null; }
    const out = [];
    for (const ch of s) { if (MARKS.test(ch) && out.length) out[out.length - 1] += ch; else out.push(ch); }
    return out.length >= 2 && out.length <= 9 ? out : null;
  };
  // Distractors: never the same Arabic word, never the same meaning as the answer (or as each other),
  // so there is always exactly one right answer.
  const base = (x) => (x.t || '').toLowerCase().replace(/\s*\([^)]*\)/g, '').trim();
  const distinct = (pool, w, n) => {
    const ars = new Set([w.ar]), ts = new Set([base(w)]); const out = [];
    for (const x of shuffle(pool)) {
      if (!x.t || ars.has(x.ar) || ts.has(base(x))) continue;
      ars.add(x.ar); ts.add(base(x)); out.push(x);
      if (out.length >= n) break;
    }
    return out;
  };
  W._distinct = distinct;

  /* ---------- Player shell ---------- */
  function Player(opts) {
    this.opts = opts;
    this.root = h('div.player', { role: 'dialog', 'aria-modal': 'true' });
    this.bar = h('i');
    this.combo = h('div.combo');
    const close = h('button.iconbtn', { 'aria-label': t('quit'), html: W.svg('close'), on: { click: () => this.quit() } });
    this.root.append(h('div.ptop', null, close, h('div.progress', null, this.bar)), this.combo);
    this.stage = h('div.stage'); this.stageIn = h('div.stage-in'); this.stage.append(this.stageIn);
    this.foot = h('div.pfoot'); this.footIn = h('div.in'); this.foot.append(this.footIn);
    this.fb = h('div.fb'); this.fbIn = h('div.in'); this.fb.append(this.fbIn);
    this.root.append(this.stage, this.foot, this.fb);
    document.body.append(this.root);
    document.body.style.overflow = 'hidden';
    this.t0 = Date.now(); this.right = 0; this.total = 0; this.streak = 0; this.best = 0;
    this.onKey = (e) => this.key(e);
    document.addEventListener('keydown', this.onKey);
    history.pushState({ player: 1 }, '');
    this.onPop = () => this.close(true);
    window.addEventListener('popstate', this.onPop);
  }
  Player.prototype = {
    progress(f) { this.bar.style.width = Math.max(0, Math.min(1, f)) * 100 + '%'; },
    show(node) {
      const old = this.stageIn.firstChild;
      const put = () => { this.stageIn.replaceChildren(node); node.classList.add('q'); this.stage.scrollTop = 0; };
      if (old && old.classList) { old.classList.add('out'); setTimeout(put, 160); } else put();
    },
    footer(...btns) { this.footIn.replaceChildren(...btns); this.foot.classList.remove('hidden'); },
    hideFooter() { this.foot.classList.add('hidden'); },
    score(ok) {
      this.total++; if (ok) { this.right++; this.streak++; this.best = Math.max(this.best, this.streak); } else this.streak = 0;
      if (this.streak >= 3) { this.combo.innerHTML = W.svg('star') + ' ' + t('streakN', { n: this.streak }); this.combo.classList.add('on'); } else this.combo.classList.remove('on');
    },
    feedback(ok, detail) {
      return new Promise((res) => {
        ok ? W.sfx.ok() : W.sfx.ko();
        const great = t('great');
        const msg = h('div.msg', null, h('div.ico', { html: W.svg(ok ? 'ok' : 'ko') }),
          h('div', null, h('h3', null, ok ? great[(Math.random() * great.length) | 0] : t('wrong')), detail ? h('p', null, detail) : null));
        const b = h('button.btn' + (ok ? '' : '.red'), { on: { click: () => { this.fb.classList.remove('on'); this._cont = null; res(); } } }, t('cont'));
        this.fbIn.replaceChildren(msg, b);
        this.fb.className = 'fb ' + (ok ? 'ok' : 'ko');
        requestAnimationFrame(() => this.fb.classList.add('on'));
        this._cont = () => b.click();
        this.hideFooter();
        setTimeout(() => b.focus({ preventScroll: true }), 50);
      });
    },
    key(e) {
      if (e.key === 'Escape') return this.quit();
      if (e.key === 'Enter') {
        if (this._cont) { e.preventDefault(); return this._cont(); }
        const b = this.footIn.querySelector('.btn:not(.outline):not([disabled])'); if (b && document.activeElement !== b) { e.preventDefault(); b.click(); }
        return;
      }
      if (this._keys && this._keys[e.key]) { e.preventDefault(); this._keys[e.key](); }
    },
    rules(game, iconName, cls) {
      return new Promise((res) => {
        const key = 'wakf.norules.' + game;
        let skip = false; try { skip = localStorage.getItem(key) === '1'; } catch (e) {}
        if (skip) return res();
        const lines = (t('rules')[game] || []);
        const cb = h('input', { type: 'checkbox' });
        const node = h('div.rules.g-' + game, null,
          (W.BADGE[game] ? h('div.bigb', { html: W.BADGE[game] }) : h('div.big', { html: W.svg(iconName) })),
          h('div.k', null, t('rulesTitle')),
          h('h1', null, t('g_' + game)),
          h('ul', null, lines.map((l, i) => h('li', null, h('b', null, String(i + 1)), h('span', null, l)))),
          h('label.chkline', null, cb, W.lang === 'en' ? 'Don’t show these rules again' : 'Ne plus afficher ces règles'));
        this.show(node);
        const go = h('button.btn.block', { on: { click: () => { if (cb.checked) { try { localStorage.setItem(key, '1'); } catch (e) {} } res(); } } }, t('go'));
        this.footer(go);
        setTimeout(() => go.focus({ preventScroll: true }), 300);
      });
    },
    result({ title, pass }) {
      return new Promise((res) => {
        W.stopSpeak();
        const acc = this.total ? Math.round((this.right / this.total) * 100) : 100;
        const s = Math.round((Date.now() - this.t0) / 1000);
        const time = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
        const box = (lbl, ic, val, c) => h('div.box', { style: { '--c': c } }, h('small', null, lbl), h('b', { html: W.svg(ic) }, val));
        this.progress(1);
        this.show(h('div.result', null,
          h('div.medal' + (pass === false ? '.retry' : ''), { html: W.svg(pass === false ? 'reload' : 'exam') }),
          h('h1', null, title),
          h('div.boxes', null, box(t('right'), 'ok', this.right + '/' + this.total, 'var(--jade)'), box(t('accuracy'), 'target', acc + ' %', 'var(--lapis)'), box(t('time'), 'clock', time, 'var(--amethyste)'))));
        if (pass !== false) { W.sfx.win(); W.confetti(); }
        const b = h('button.btn.block', { on: { click: () => { res(); this.close(); } } }, t('cont'));
        this.footer(b); this.combo.classList.remove('on');
      });
    },
    async quit() {
      if (this.closed || this._asking) return;
      if (this.total === 0) return this.close();
      this._asking = true;
      const ok = await W.dialog({ title: t('quitTitle'), text: t('quitText'), icon: 'close', ok: t('quit'), cancel: t('stay'), danger: true, color: 'grenade' });
      this._asking = false;
      if (ok) this.close();
    },
    close(fromPop) {
      if (this.closed) return; this.closed = true;
      W.stopSpeak();
      document.removeEventListener('keydown', this.onKey);
      window.removeEventListener('popstate', this.onPop);
      if (!fromPop && history.state && history.state.player) history.back();
      this.root.style.transition = 'opacity .2s'; this.root.style.opacity = '0';
      setTimeout(() => { this.root.remove(); document.body.style.overflow = ''; }, 200);
      this.opts.onClose && this.opts.onClose();
    },
  };
  W.Player = Player;

  /* ---------- reusable question widgets ---------- */
  // Generic choice question. options: [{node, value}], answer value. Returns Promise<bool>
  function choice(P, { head, options, correct, detail, cls }) {
    return new Promise((res) => {
      let sel = null;
      const btns = options.map((o, i) => {
        const b = h('button.opt', { on: { click: () => { select(i); } } }, h('span.num', null, String(i + 1)), o.node);
        return b;
      });
      const select = (i) => { if (P._locked) return; sel = i; btns.forEach((b, j) => b.classList.toggle('sel', j === i)); check.disabled = false; W.sfx.tap(); options[i].onSelect && options[i].onSelect(); };
      P._keys = {}; btns.forEach((_, i) => (P._keys[String(i + 1)] = () => select(i)));
      const node = h('div', null, head, h('div.opts' + (cls ? '.' + cls : ''), null, btns));
      P.show(node);
      const check = h('button.btn', { disabled: true, on: { click: () => {
        if (sel == null) return; P._locked = true; P._keys = null;
        const ok = options[sel].value === correct;
        btns[sel].classList.remove('sel'); btns[sel].classList.add(ok ? 'good' : 'bad');
        if (!ok) btns[options.findIndex((o) => o.value === correct)].classList.add('good');
        P.score(ok);
        P.feedback(ok, ok ? null : detail).then(() => { P._locked = false; res(ok); });
      } } }, t('check'));
      const skip = h('button.btn.outline', { on: { click: () => { P._locked = true; P._keys = null; P.score(false); P.feedback(false, detail).then(() => { P._locked = false; res(false); }); } } }, t('skip'));
      P.footer(skip, check);
    });
  }
  const detailAr = (w) => h('span', null, t('correctAns') + ' ', ar(w.ar), ' — ' + W.wordLabel(w));

  // FR/EN -> AR
  W.qToAr = (P, w, pool) => {
    const opts = shuffle([w, ...distinct(pool, w, 3, 'ar')]);
    return choice(P, {
      head: h('div.qtitle', null, t('howSay', { w: W.wordLabel(w) })),
      options: opts.map((x) => ({ node: ar(x.ar), value: x.ar, onSelect: () => W.say(x.ar, x.audio) })),
      correct: w.ar, detail: detailAr(w),
    });
  };
  // AR -> FR/EN
  W.qToNative = (P, w, pool) => {
    const opts = shuffle([w, ...distinct(pool, w, 3, 't')]);
    const sp = W.sayBtn(w.ar, w.audio);
    setTimeout(() => W.say(w.ar, w.audio, { el: sp }), 380);
    return choice(P, {
      head: h('div', null, h('div.qtitle', null, t('whatMeans')),
        h('div.prompt', null, sp, h('div.bub', null, ar(w.ar)))),
      options: opts.map((x) => ({ node: h('span', null, W.wordLabel(x)), value: x.t })),
      correct: w.t, detail: detailAr(w),
    });
  };
  // Listen & pick (Arabic script options) — "Qu'entends-tu ?"
  W.qListen = (P, w, pool, n) => {
    const opts = shuffle([w, ...distinct(pool.filter((x) => x.ar !== w.ar), w, (n || 2) - 1, 'ar')]);
    const big = h('button.speaker', { 'aria-label': t('listen'), html: icon.speaker, on: { click: () => W.say(w.ar, w.audio, { el: big }) } });
    const slow = h('button.speaker.slow', { 'aria-label': t('listenSlow'), html: icon.turtle, on: { click: () => W.say(w.ar, w.audio, { el: slow, rate: 0.5 }) } });
    setTimeout(() => W.say(w.ar, w.audio, { el: big }), 380);
    return choice(P, {
      head: h('div', null, h('div.qtitle', null, t('whatHear')), h('div.speakrow', null, big, slow)),
      options: opts.map((x) => ({ node: ar(x.ar), value: x.ar })),
      correct: w.ar, detail: h('span', null, t('correctAns') + ' ', ar(w.ar)), cls: opts.length === 2 ? 'two' : '',
    });
  };
  // Tap what you hear — rebuild from tiles
  W.qHear = (P, w, pool) => new Promise((res) => {
    const tiles = W.tilesFor(w.ar);
    const isWords = cleanAr(w.ar).includes(' ');
    const others = new Set(tiles);
    const extra = [];
    for (const x of shuffle(pool)) { const tt = W.tilesFor(x.ar); if (!tt) continue; for (const k of shuffle(tt)) if (!others.has(k)) { others.add(k); extra.push(k); break; } if (extra.length >= (isWords ? 2 : 3)) break; }
    const bankItems = shuffle([...tiles, ...extra]).map((v, i) => ({ v, i }));
    const placed = [];
    const answer = h('div.answer', { dir: 'rtl' });
    const bank = h('div.bank', { dir: 'rtl' });
    const chips = bankItems.map((it) => {
      const c = h('button.chip', { lang: 'ar', on: { click: () => toggle(it) } }, it.v);
      it.el = c; return c;
    });
    bank.append(...chips);
    const render = () => {
      answer.replaceChildren(...placed.map((it) => h('button.chip', { lang: 'ar', on: { click: () => toggle(it) } }, it.v)));
      chips.forEach((c, i) => c.classList.toggle('ghost', placed.includes(bankItems[i])));
      check.disabled = !placed.length;
    };
    const toggle = (it) => { if (P._locked) return; const k = placed.indexOf(it); if (k >= 0) placed.splice(k, 1); else { placed.push(it); W.speak(it.v, 'ar', { rate: 0.7 }); } W.sfx.tap(); render(); };
    const big = h('button.speaker', { 'aria-label': t('listen'), html: icon.speaker, on: { click: () => W.say(w.ar, w.audio, { el: big }) } });
    const slow = h('button.speaker.slow', { 'aria-label': t('listenSlow'), html: icon.turtle, on: { click: () => W.say(w.ar, w.audio, { el: slow, rate: 0.5 }) } });
    P.show(h('div', null, h('div.qtitle', null, t('tapHear')), h('div.speakrow', null, big, slow), answer, bank));
    setTimeout(() => W.say(w.ar, w.audio, { el: big }), 380);
    P._keys = null;
    const check = h('button.btn', { disabled: true, on: { click: () => {
      P._locked = true;
      const ok = placed.map((x) => x.v).join(isWords ? ' ' : '') === tiles.join(isWords ? ' ' : '');
      P.score(ok);
      P.feedback(ok, h('span', null, ok ? '' : t('correctAns') + ' ', ar(w.ar), ' — ' + W.wordLabel(w))).then(() => { P._locked = false; res(ok); });
    } } }, t('check'));
    const skip = h('button.btn.outline', { on: { click: () => { P._locked = true; P.score(false); P.feedback(false, detailAr(w)).then(() => { P._locked = false; res(false); }); } } }, t('skip'));
    P.footer(skip, check);
  });
  // Pairs round. mode 'tr' (arabic ↔ translation) or 'sound' (audio ↔ arabic script). Returns Promise<mistakes>
  W.qPairs = (P, set, mode) => new Promise((res) => {
    let selL = null, selR = null, left = set.length, errors = 0;
    const L = shuffle(set), R = shuffle(set);
    const wave = () => { const s = h('span.wave'); [10, 16, 24, 30, 22, 14, 26, 18, 10].forEach((v, i) => s.append(h('i', { style: { '--h': v + 'px', '--d': i } }))); return s; };
    const lb = L.map((w) => {
      const b = mode === 'sound'
        ? h('button.opt.audio', { 'aria-label': t('listen') }, h('span', { html: icon.speaker, style: { width: '26px', display: 'inline-flex' } }), wave())
        : h('button.opt', null, ar(w.ar));
      b.addEventListener('click', () => { if (b._done) return; selL = w; lb.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); W.say(w.ar, w.audio, { el: mode === 'sound' ? b : null }); tryMatch(); });
      b._w = w; return b;
    });
    const rb = R.map((w) => {
      const b = h('button.opt', null, mode === 'sound' ? ar(w.ar) : h('span', null, W.wordLabel(w)));
      b.addEventListener('click', () => { if (b._done) return; selR = w; rb.forEach((x) => x.classList.remove('sel')); b.classList.add('sel'); W.sfx.tap(); tryMatch(); });
      b._w = w; return b;
    });
    const tryMatch = () => {
      if (!selL || !selR) return;
      const a = lb.find((b) => b._w === selL), b = rb.find((x) => x._w === selR);
      const ok = selL.ar === selR.ar;
      a.classList.remove('sel'); b.classList.remove('sel');
      if (ok) {
        a._done = b._done = true; a.classList.add('good'); b.classList.add('good');
        // audio feedback in the learner's native language (or Arabic for sound-mode)
        W.say(selL.ar, selL.audio);
        W.sfx.ok();
        setTimeout(() => { a.classList.add('done'); b.classList.add('done'); }, 450);
        if (--left === 0) setTimeout(() => { P.score(errors === 0); res(errors); }, 900);
      } else {
        errors++; W.srsMiss(selL.id); W.sfx.ko(); a.classList.add('bad'); b.classList.add('bad');
        setTimeout(() => { a.classList.remove('bad'); b.classList.remove('bad'); }, 450);
      }
      selL = selR = null;
    };
    P.show(h('div', null, h('div.qtitle', null, t('tapPairs')), h('div.pairs', null, h('div.col', null, lb), h('div.col', null, rb))));
    P._keys = null;
    P.hideFooter();
  });

  // every missed word goes to the review queue
  const track = (f) => (P, w, ...a) => f(P, w, ...a).then((ok) => { if (!ok && w && w.id) W.srsMiss(w.id); return ok; });
  W.qToAr = track(W.qToAr); W.qToNative = track(W.qToNative); W.qHear = track(W.qHear); W.qListen = track(W.qListen);

  /* ---------- Games ---------- */
  const GAMES = {};
  W.GAMES = GAMES;
  const meta = { flash: 'flash', hear: 'hear', trans: 'trans', pairs: 'pairs', exam: 'exam', guided: 'pageRead', listen: 'speaker', lpairs: 'pairs', write: 'read' };
  W.gameMeta = meta;

  GAMES.flash = async (P, words) => {
    let queue = shuffle(words); const total = queue.length; let done = 0;
    const one = (w) => new Promise((res) => {
      const card = h('div.flash', { role: 'button', tabindex: 0, 'aria-label': t('tapToFlip') });
      const sp = W.sayBtn(w.ar, w.audio);
      const front = h('div.face', null, ar(w.ar), w.extra ? h('div.ex', null, ar(w.extra)) : null, h('div.hint', null, t('tapToFlip')));
      const back = h('div.face.back', null, h('div.tr', null, W.wordLabel(w)), ar(w.ar), w.group ? h('div.ex', null, w.group) : null);
      card.append(h('div.inner', null, front, back));
      const flip = () => { card.classList.toggle('flip'); W.sfx.flip(); if (card.classList.contains('flip')) showRate(); };
      card.addEventListener('click', flip);
      card.addEventListener('keydown', (e) => { if (e.key === ' ') { e.preventDefault(); flip(); } });
      P.show(h('div', null, h('div', { style: { display: 'flex', justifyContent: 'center' } }, sp), card));
      setTimeout(() => W.say(w.ar, w.audio, { el: sp }), 350);
      const showB = h('button.btn.lapis.block', { on: { click: flip } }, t('showAns'));
      P.footer(showB);
      P._keys = { ' ': flip };
      const rate = (r) => () => {
        W.srsRate(w.id, r);
        P.score(r >= 2);
        res(r);
      };
      const showRate = () => {
        const mk = (cls, k, r, sub) => h('button.btn' + cls, { on: { click: rate(r) } }, t(k), h('small', null, sub));
        const en = W.lang === 'en';
        P.footer(h('div.rate', null, mk('.red', 'r_fail', 0, en ? 'right away' : 'tout de suite'), mk('.safran', 'r_hard', 1, en ? 'later on' : 'plus loin'), mk('', 'r_good', 2, en ? 'in 3 days' : 'dans 3 jours'), mk('.lapis', 'r_easy', 3, en ? 'in 10 days' : 'dans 10 jours')));
        P._keys = { 1: rate(0), 2: rate(1), 3: rate(2), 4: rate(3), ' ': flip };
      };
    });
    while (queue.length) {
      const w = queue.shift();
      const r = await one(w);
      if (r === 0) queue.splice(Math.min(1, queue.length), 0, w); // fail: comes back right away (next card)
      else if (r === 1) queue.splice(Math.max(Math.min(6, queue.length), Math.floor(queue.length / 2)), 0, w); // hard: further in the game
      else done++;
      P.progress(done / total);
      if (P.closed) return;
    }
    return { xp: 10 + Math.min(10, total) };
  };

  /* Tap what you hear — hear a short sequence of 2–3 whole words, tap them in the order heard */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  W.qHearSeq = (P, seq, pool) => new Promise((res) => {
    const inSeq = new Set(seq.map((w) => w.ar));
    const extra = shuffle(pool.filter((x) => !inSeq.has(x.ar))).filter((x, i, a) => a.findIndex((y) => y.ar === x.ar) === i).slice(0, 2);
    const bankItems = shuffle([...seq, ...extra]).map((w, i) => ({ w, i }));
    const placed = [];
    const answer = h('div.answer.words', { dir: 'rtl' });
    const bank = h('div.bank', { dir: 'rtl' });
    const chips = bankItems.map((it) => { const c = h('button.chip.word', { lang: 'ar', on: { click: () => toggle(it) } }, it.w.ar); it.el = c; return c; });
    bank.append(...chips);
    let playing = false;
    const play = async (el, rate) => { if (playing) return; playing = true; el && el.classList.add('playing'); for (const w of seq) { await W.say(w.ar, w.audio, { rate, queue: true }); await sleep(380); } el && el.classList.remove('playing'); playing = false; };
    const render = () => {
      answer.replaceChildren(...placed.map((it) => h('button.chip.word', { lang: 'ar', on: { click: () => toggle(it) } }, it.w.ar)));
      chips.forEach((c, i) => c.classList.toggle('ghost', placed.includes(bankItems[i])));
      check.disabled = placed.length !== seq.length;
    };
    const toggle = (it) => { if (P._locked) return; const k = placed.indexOf(it); if (k >= 0) placed.splice(k, 1); else if (placed.length < seq.length) { placed.push(it); W.say(it.w.ar, it.w.audio); } W.sfx.tap(); render(); };
    const big = h('button.speaker', { 'aria-label': t('listen'), html: W.svg('speaker'), on: { click: () => play(big) } });
    const slow = h('button.speaker.slow', { 'aria-label': t('listenSlow'), html: W.svg('slow'), on: { click: () => play(slow, 0.55) } });
    const n = seq.length;
    P.show(h('div', null, h('div.qtitle', null, t('tapHear')), h('p.muted', { style: { margin: '-12px 0 14px' } }, W.lang === 'en' ? `Tap the ${n} words in the order you hear them.` : `Touche les ${n} mots dans l’ordre où tu les entends.`), h('div.speakrow', null, big, slow), answer, bank));
    setTimeout(() => play(big), 450);
    P._keys = null;
    const detail = () => h('span', null, t('correctAns') + ' ', ...seq.map((w, i) => h('span', null, i ? ' · ' : '', ar(w.ar), ' (' + W.wordLabel(w) + ')')));
    const check = h('button.btn', { disabled: true, on: { click: () => {
      P._locked = true;
      const ok = placed.every((it, i) => it.w.ar === seq[i].ar);
      if (!ok) seq.forEach((w, i) => { if (!placed[i] || placed[i].w.ar !== w.ar) W.srsMiss(w.id); });
      P.score(ok);
      P.feedback(ok, ok ? h('span', null, ...seq.map((w, i) => h('span', null, i ? ' · ' : '', W.wordLabel(w)))) : detail()).then(() => { P._locked = false; res(ok); });
    } } }, t('check'));
    const skip = h('button.btn.outline', { on: { click: () => { P._locked = true; seq.forEach((w) => W.srsMiss(w.id)); P.score(false); P.feedback(false, detail()).then(() => { P._locked = false; res(false); }); } } }, t('skip'));
    P.footer(skip, check);
  });
  GAMES.hear = async (P, words, pool) => {
    const list = shuffle(words.filter((w) => w.t));
    const rounds = []; for (let i = 0; i < list.length; i += 3) rounds.push(list.slice(i, i + 3));
    if (rounds.length > 1 && rounds[rounds.length - 1].length < 2) rounds[rounds.length - 2].push(...rounds.pop());
    for (let i = 0; i < rounds.length; i++) { P.progress(i / rounds.length); await W.qHearSeq(P, rounds[i].slice(0, 4), pool); if (P.closed) return; }
    return {};
  };

  GAMES.trans = async (P, words, pool) => {
    const list = shuffle(words);
    const start = Math.random() < 0.5 ? 0 : 1; // strict alternation, 50/50
    for (let i = 0; i < list.length; i++) {
      P.progress(i / list.length);
      if ((i + start) % 2 === 0) await W.qToAr(P, list[i], pool); else await W.qToNative(P, list[i], pool);
      if (P.closed) return;
    }
    return { xp: 10 + Math.round((P.right / P.total) * 10) };
  };

  const pairable = (words) => { const seenA = new Set(), seenT = new Set(); return words.filter((w) => w.t && !seenA.has(w.ar) && !seenT.has(base(w)) && seenA.add(w.ar) && seenT.add(base(w))); };
  GAMES.pairs = async (P, words) => {
    const list = shuffle(pairable(words));
    const rounds = []; for (let i = 0; i < list.length; i += 5) rounds.push(list.slice(i, i + 5));
    if (rounds.length > 1 && rounds[rounds.length - 1].length < 3) { const last = rounds.pop(); rounds[rounds.length - 1].push(...last); }
    for (let r = 0; r < rounds.length; r++) { P.progress(r / rounds.length); await W.qPairs(P, rounds[r].slice(0, 6), 'tr'); if (P.closed) return; }
    return { xp: 10 + rounds.length * 2 };
  };

  GAMES.exam = async (P, words, pool) => {
    const list = shuffle(words.filter((w) => w.t));
    const kinds = shuffle(list.map((_, i) => ['ar', 'native', 'listen'][i % 3]));
    for (let i = 0; i < list.length; i++) {
      P.progress(i / list.length);
      const w = list[i];
      if (kinds[i] === 'ar') await W.qToAr(P, w, pool);
      else if (kinds[i] === 'native') await W.qToNative(P, w, pool);
      else await W.qListen(P, w, pool, 4);
      if (P.closed) return;
    }
    const need = Math.ceil(list.length * 0.8);
    const pass = P.right >= need;
    return { pass, score: Math.round((P.right / Math.max(1, list.length)) * 100), raw: P.right + '/' + list.length };
  };

  /* Reading-specific: listen & pick among items */
  GAMES.listen = async (P, items) => {
    const list = shuffle(items).slice(0, 10);
    for (let i = 0; i < list.length; i++) { P.progress(i / list.length); await W.qListen(P, list[i], items, items.length > 12 ? 3 : 2); if (P.closed) return; }
    return { xp: 10 };
  };
  GAMES.lpairs = async (P, items) => {
    const uniq = []; const s = new Set(); for (const x of shuffle(items)) if (!s.has(x.ar)) { s.add(x.ar); uniq.push(x); }
    const rounds = []; for (let i = 0; i < Math.min(uniq.length, 15); i += 5) rounds.push(uniq.slice(i, i + 5));
    if (rounds.length > 1 && rounds[rounds.length - 1].length < 3) { const l = rounds.pop(); rounds[rounds.length - 1].push(...l); }
    for (let r = 0; r < rounds.length; r++) { P.progress(r / rounds.length); await W.qPairs(P, rounds[r], 'sound'); if (P.closed) return; }
    return { xp: 10 };
  };

  /* ---------- launcher ---------- */
  W.playGame = async ({ game, lessonId, words, pool, onDone, runner }) => {
    const P = new Player({ onClose: () => onDone && onDone() });
    await P.rules(game, meta[game] || 'rules');
    if (P.closed) return;
    const fn = runner || GAMES[game];
    const r = await fn(P, words, pool || words);
    if (P.closed || !r) return;
    const title = game === 'exam' ? (r.pass ? t('examPass') : t('examFail')) + ' ' + r.raw : t('done');
    if (lessonId) { if (game === 'exam') { W.markGame(lessonId, 'exam', r.score); W.lessonState(lessonId).examRaw = r.raw; W.save(); } else W.markGame(lessonId, game, 1); }
    await P.result({ title, pass: game === 'exam' ? r.pass : true });
  };
})();
