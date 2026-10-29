/* Wakf — core: i18n, storage, audio (TTS + sfx), DOM helpers, router */
(function () {
  'use strict';
  const W = (window.W = {});

  /* ---------------- i18n ---------------- */
  const STR = {
    fr: {
      appTag: 'Apprendre l’arabe, simplement.',
      chooseLang: 'Choisis ta langue', chooseLangSub: 'Tout le site s’affichera dans cette langue.',
      home: 'Accueil', profile: 'Profil', learn: 'Apprendre',
      hello: 'Salam !', homeSub: 'Que veux-tu apprendre aujourd’hui ?',
      dailyGoal: 'Objectif du jour', xp: 'XP', streak: 'jours',
      th_surah: 'Sourates & Mind maps', th_surah_d: 'Comprendre les sourates grâce à des cartes mentales.',
      th_w85: '85 % des mots du Coran', th_w85_d: 'Les mots qui couvrent 85 % du texte coranique.',
      th_read: 'Apprendre à lire', th_read_d: 'Les lettres et la lecture, leçon par leçon.',
      th_w1000: 'Les 1000 mots arabes', th_w1000_d: 'Les mots les plus fréquents de l’arabe.',
      soon: 'Bientôt', lessons: 'leçons', lesson: 'Leçon', words: 'mots', start: 'Commencer', review: 'Réviser',
      tabGame: 'Jeux', tabList: 'Liste',
      g_flash: 'Flashcards', g_flash_d: 'Retourne la carte et note ta mémoire.',
      g_hear: 'Tape ce que tu entends', g_hear_d: 'Écoute puis reconstitue le mot.',
      g_trans: 'Traduction', g_trans_d: 'Comment dit-on… ? Dans les deux sens.',
      g_pairs: 'Appuie sur les paires', g_pairs_d: 'Relie chaque mot à sa traduction.',
      g_exam: 'Examen final', g_exam_d: 'Valide la leçon (80 % requis).',
      g_guided: 'Lecture guidée', g_guided_d: 'Toute la page, dans l’ordre du livre.',
      g_listen: 'Qu’entends-tu ?', g_listen_d: 'Écoute et choisis ce que tu entends.',
      g_lpairs: 'Son ↔ écriture', g_lpairs_d: 'Relie chaque son à son écriture.',
      g_write: 'Écriture', g_write_d: 'Trace les lettres et les mots modèles.',
      rulesTitle: 'Règles du jeu', go: 'C’est parti !', check: 'Valider', cont: 'Continuer', skip: 'Passer', quit: 'Quitter',
      great: ['Excellent !', 'Bravo !', 'Super !', 'Parfait !', 'Bien joué !'], wrong: 'Pas tout à fait…', correctAns: 'Bonne réponse :',
      howSay: 'Comment dit-on « {w} » ?', whatMeans: 'Que veut dire ce mot ?', whatHear: 'Qu’entends-tu ?', tapHear: 'Tape ce que tu entends', tapPairs: 'Appuie sur les paires',
      showAns: 'Retourner', tapToFlip: 'Touche pour retourner',
      r_fail: 'Échec', r_hard: 'Difficile', r_good: 'Bon', r_easy: 'Facile',
      done: 'Leçon terminée !', examPass: 'Leçon validée !', examFail: 'Presque ! Réessaie pour valider.',
      totalXp: 'XP gagnés', accuracy: 'Précision', time: 'Temps',
      combo: 'combo', hearts: 'vies', outOfHearts: 'Plus de vies !',
      noVoice: 'Aucune voix arabe trouvée sur cet appareil : installe une voix « arabe » dans les réglages pour entendre la prononciation.',
      quitConfirm: 'Quitter ? Ta progression dans ce jeu sera perdue.',
      list_tip: 'Touche un mot pour l’écouter.',
      settings: 'Réglages', language: 'Langue', changeLang: 'Changer de langue', resetProgress: 'Réinitialiser la progression', resetConfirm: 'Effacer toute ta progression ?',
      install: 'Installer l’application', installed: 'Application installée',
      lessonsDone: 'Leçons validées', wordsSeen: 'Mots révisés', bestStreak: 'Meilleure série',
      sources: 'Sources', sourcesText: 'Contenus repris strictement des ressources fournies par l’institut.',
      notYet: 'Contenu en préparation', notYetSub: 'Cette rubrique arrive très bientôt, in shā’ Allah.',
      w1000_wait: 'La liste des 1000 mots doit encore être fournie par l’institut (droits d’utilisation de la source).',
      surahsTitle: 'Sourates', surahN: 'Sourate {n}', mmVisual: 'Liens visuels', mmMental: 'Liens mentaux', mmSoon: 'Les autres sourates arrivent bientôt.',
      refrain: 'Refrain', refrainHint: 'Le refrain revient après ce verset', listenAyah: 'Écouter',
      readPart1: '1ʳᵉ partie — les lettres', readPart2: '2ᵉ partie — lecture', readIntro: 'L’alphabet', readSurahs: 'Sourates & invocations',
      page: 'page', writingPage: 'Page d’écriture', clear: 'Effacer', traceTip: 'Trace par-dessus le modèle avec ton doigt ou la souris.',
      b_letters: 'Les voyelles', b_syllables: 'Syllabes', b_words: 'Mots', b_sentences: 'Phrases', b_forms: 'Les formes', b_note: 'À retenir', b_table: 'Tableau', b_other: 'Remarque', b_text: 'Texte',
      formsLbl: ['Au début', 'Au milieu', 'À la fin', 'Tout seul'],
      readTap: 'Touche chaque élément pour l’écouter, dans l’ordre.', nextBlock: 'Suite', listenAll: 'Tout écouter',
      unitOf: 'Unité', lessonN: 'Leçon {n}', wordsN: '{n} mots',
      tags: { mg: 'masc.', fg: 'fém.', 'mg/fg': 'masc./fém.', dl: 'duel', 'for br.pl': 'pl. brisé' },
      rules: {
        flash: ['Regarde le mot arabe et essaie de te souvenir de sa traduction.', 'Touche la carte pour la retourner.', 'Note-toi honnêtement : Échec, Difficile, Bon ou Facile.', 'Les cartes ratées reviennent plus vite.'],
        hear: ['Écoute le mot en arabe (touche le haut-parleur pour réécouter).', 'Touche les morceaux dans l’ordre pour reconstituer ce que tu entends.', 'L’arabe se lit de droite à gauche.', 'Valide quand tu as fini.'],
        trans: ['Une question sur deux : « Comment dit-on… ? » en arabe.', 'L’autre : trouve la traduction du mot arabe.', 'Choisis la bonne réponse puis valide.', 'Enchaîne les bonnes réponses pour faire un combo !'],
        pairs: ['Touche un mot arabe puis sa traduction.', 'À chaque paire trouvée, tu entends le mot.', 'Une erreur ? Les deux cases tremblent, réessaie.', 'Trouve toutes les paires pour finir la manche.'],
        exam: ['Toutes les épreuves mélangées sur les mots de la leçon.', 'Tu as 3 vies : chaque erreur en coûte une.', 'Il faut 80 % de bonnes réponses pour valider.', 'Une leçon validée gagne une couronne 👑.'],
        guided: ['On suit la page du livre de haut en bas.', 'Touche chaque élément pour l’entendre, puis répète-le à voix haute.', 'Après chaque bloc : une petite question d’écoute.', 'Va jusqu’au bout de la page !'],
        listen: ['Écoute le son.', 'Choisis ce que tu as entendu.', 'Touche le haut-parleur pour réécouter.', 'Valide ta réponse.'],
        lpairs: ['Les cases bleues sont des sons : touche-les pour écouter.', 'Relie chaque son à son écriture.', 'Trouve toutes les paires pour finir.'],
        write: ['Reprends la page d’écriture du livre.', 'Trace chaque lettre par-dessus le modèle, de droite à gauche.', 'Puis recopie les mots modèles.', 'Efface et recommence autant que tu veux.'],
      },
    },
    en: {
      appTag: 'Learn Arabic, simply.',
      chooseLang: 'Choose your language', chooseLangSub: 'The whole site will be shown in this language.',
      home: 'Home', profile: 'Profile', learn: 'Learn',
      hello: 'Salam!', homeSub: 'What do you want to learn today?',
      dailyGoal: 'Daily goal', xp: 'XP', streak: 'days',
      th_surah: 'Quran Surahs & Mindmaps', th_surah_d: 'Understand surahs through mind maps.',
      th_w85: '85% of Quranic Words', th_w85_d: 'The words that cover 85% of the Quranic text.',
      th_read: 'Learn How to Read', th_read_d: 'Letters and reading, lesson by lesson.',
      th_w1000: 'The 1000 Arabic Words', th_w1000_d: 'The most frequent words in Arabic.',
      soon: 'Soon', lessons: 'lessons', lesson: 'Lesson', words: 'words', start: 'Start', review: 'Review',
      tabGame: 'Games', tabList: 'List',
      g_flash: 'Flashcards', g_flash_d: 'Flip the card and rate your memory.',
      g_hear: 'Tap what you hear', g_hear_d: 'Listen, then rebuild the word.',
      g_trans: 'Translation', g_trans_d: 'How do you say…? Both ways.',
      g_pairs: 'Tap the pairs', g_pairs_d: 'Match each word with its translation.',
      g_exam: 'Final exam', g_exam_d: 'Pass the lesson (80% needed).',
      g_guided: 'Guided reading', g_guided_d: 'The whole page, in the book’s order.',
      g_listen: 'What do you hear?', g_listen_d: 'Listen and pick what you hear.',
      g_lpairs: 'Sound ↔ writing', g_lpairs_d: 'Match each sound with its writing.',
      g_write: 'Writing', g_write_d: 'Trace the model letters and words.',
      rulesTitle: 'How to play', go: 'Let’s go!', check: 'Check', cont: 'Continue', skip: 'Skip', quit: 'Quit',
      great: ['Excellent!', 'Great job!', 'Awesome!', 'Perfect!', 'Well done!'], wrong: 'Not quite…', correctAns: 'Correct answer:',
      howSay: 'How do you say “{w}”?', whatMeans: 'What does this word mean?', whatHear: 'What do you hear?', tapHear: 'Tap what you hear', tapPairs: 'Tap the pairs',
      showAns: 'Flip', tapToFlip: 'Tap to flip',
      r_fail: 'Fail', r_hard: 'Hard', r_good: 'Good', r_easy: 'Easy',
      done: 'Lesson complete!', examPass: 'Lesson passed!', examFail: 'Almost! Try again to pass.',
      totalXp: 'XP earned', accuracy: 'Accuracy', time: 'Time',
      combo: 'combo', hearts: 'lives', outOfHearts: 'Out of lives!',
      noVoice: 'No Arabic voice found on this device: install an “Arabic” voice in your settings to hear the pronunciation.',
      quitConfirm: 'Quit? Your progress in this game will be lost.',
      list_tip: 'Tap a word to hear it.',
      settings: 'Settings', language: 'Language', changeLang: 'Change language', resetProgress: 'Reset progress', resetConfirm: 'Erase all your progress?',
      install: 'Install the app', installed: 'App installed',
      lessonsDone: 'Lessons passed', wordsSeen: 'Words reviewed', bestStreak: 'Best streak',
      sources: 'Sources', sourcesText: 'Content taken strictly from the resources provided by the institute.',
      notYet: 'Content in preparation', notYetSub: 'This section is coming very soon, in shā’ Allah.',
      w1000_wait: 'The list of 1000 words still has to be provided by the institute (usage rights for the source).',
      surahsTitle: 'Surahs', surahN: 'Surah {n}', mmVisual: 'Visual links', mmMental: 'Mental links', mmSoon: 'More surahs are coming soon.',
      refrain: 'Refrain', refrainHint: 'The refrain follows this verse', listenAyah: 'Listen',
      readPart1: 'Part 1 — the letters', readPart2: 'Part 2 — reading', readIntro: 'The alphabet', readSurahs: 'Surahs & invocations',
      page: 'page', writingPage: 'Writing page', clear: 'Clear', traceTip: 'Trace over the model with your finger or mouse.',
      b_letters: 'The vowels', b_syllables: 'Syllables', b_words: 'Words', b_sentences: 'Sentences', b_forms: 'Letter forms', b_note: 'Remember', b_table: 'Table', b_other: 'Note', b_text: 'Text',
      formsLbl: ['Beginning', 'Middle', 'End', 'On its own'],
      readTap: 'Tap each item to hear it, in order.', nextBlock: 'Next', listenAll: 'Listen to all',
      unitOf: 'Unit', lessonN: 'Lesson {n}', wordsN: '{n} words',
      tags: { mg: 'masc.', fg: 'fem.', 'mg/fg': 'masc./fem.', dl: 'dual', 'for br.pl': 'broken pl.' },
      rules: {
        flash: ['Look at the Arabic word and try to recall its meaning.', 'Tap the card to flip it.', 'Rate yourself honestly: Fail, Hard, Good or Easy.', 'Missed cards come back sooner.'],
        hear: ['Listen to the Arabic word (tap the speaker to replay).', 'Tap the pieces in order to rebuild what you hear.', 'Arabic reads from right to left.', 'Check when you are done.'],
        trans: ['Every other question: “How do you say…?” in Arabic.', 'The other: find the meaning of the Arabic word.', 'Pick the right answer, then check.', 'Chain right answers for a combo!'],
        pairs: ['Tap an Arabic word, then its translation.', 'Each time you match a pair, you hear the word.', 'A mistake? Both tiles shake — try again.', 'Find all the pairs to finish the round.'],
        exam: ['All the challenges mixed, on this lesson’s words.', 'You have 3 lives: each mistake costs one.', 'You need 80% right answers to pass.', 'A passed lesson earns a crown 👑.'],
        guided: ['We follow the book page from top to bottom.', 'Tap each item to hear it, then repeat it out loud.', 'After each block: a short listening question.', 'Go all the way to the end of the page!'],
        listen: ['Listen to the sound.', 'Pick what you heard.', 'Tap the speaker to replay.', 'Check your answer.'],
        lpairs: ['Blue tiles are sounds: tap them to listen.', 'Match each sound with its writing.', 'Find all the pairs to finish.'],
        write: ['This is the book’s writing page.', 'Trace each letter over the model, from right to left.', 'Then copy the model words.', 'Clear and start again as often as you like.'],
      },
    },
  };
  W.lang = null;
  W.t = (k, vars) => {
    let s = (STR[W.lang || 'fr'] || STR.fr)[k];
    if (s === undefined) s = STR.fr[k];
    if (s === undefined) return k;
    if (vars && typeof s === 'string') for (const v in vars) s = s.replace('{' + v + '}', vars[v]);
    return s;
  };
  W.tr = (o, base) => (o ? o[(base || '') + (W.lang === 'en' ? 'en' : 'fr')] || o[(base || '') + 'en'] || o[(base || '') + 'fr'] || '' : '');

  /* ---------------- storage ---------------- */
  const KEY = 'wakf.v1';
  const DEF = { lang: null, xp: 0, daily: { d: '', xp: 0 }, streak: { last: '', n: 0, best: 0 }, lessons: {}, srs: {}, seen: 0 };
  let S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEF); }
  W.state = S;
  W.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const today = () => { const d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
  W.addXP = (n) => {
    const d = today();
    if (S.daily.d !== d) S.daily = { d, xp: 0 };
    S.daily.xp += n; S.xp += n;
    if (S.streak.last !== d) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      const yd = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
      S.streak.n = S.streak.last === yd ? S.streak.n + 1 : 1;
      S.streak.last = d; S.streak.best = Math.max(S.streak.best || 0, S.streak.n);
    }
    W.save();
  };
  W.dailyXP = () => (S.daily.d === today() ? S.daily.xp : 0);
  W.streakN = () => {
    const d = today(); const y = new Date(); y.setDate(y.getDate() - 1);
    const yd = y.getFullYear() + '-' + (y.getMonth() + 1) + '-' + y.getDate();
    return S.streak.last === d || S.streak.last === yd ? S.streak.n : 0;
  };
  W.lessonState = (id) => (S.lessons[id] = S.lessons[id] || { games: {}, exam: 0 });
  W.markGame = (id, g, score) => { const L = W.lessonState(id); L.games[g] = Math.max(L.games[g] || 0, score || 1); if (g === 'exam') L.exam = Math.max(L.exam || 0, score); W.save(); };

  /* ---------------- DOM helpers ---------------- */
  W.h = function h(tag, attrs, ...kids) {
    const m = /^([a-z0-9]+)?((?:[.#][\w-]+)*)$/i.exec(tag) || [];
    const el = document.createElement(m[1] || 'div');
    (m[2] || '').replace(/([.#])([\w-]+)/g, (_, t, v) => (t === '.' ? el.classList.add(v) : (el.id = v)));
    if (attrs) for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'on') for (const e in v) el.addEventListener(e, v[e]);
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'style' && typeof v === 'object') { for (const sk in v) sk.startsWith('--') ? el.style.setProperty(sk, v[sk]) : (el.style[sk] = v[sk]); }
      else if (k in el && k !== 'list' && typeof v !== 'string') el[k] = v;
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (const k of kids.flat(Infinity)) if (k != null && k !== false) el.append(k.nodeType ? k : document.createTextNode(k));
    return el;
  };
  W.ar = (txt, cls) => W.h('span.ar' + (cls ? '.' + cls : ''), { lang: 'ar', dir: 'rtl' }, txt);
  W.shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
  W.pick = (a, n) => W.shuffle(a).slice(0, n);
  W.$ = (s, r) => (r || document).querySelector(s);
  W.icon = {
    speaker: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 9.5C4 8.67 4.67 8 5.5 8H8l4.2-3.36A1.1 1.1 0 0 1 14 5.5v13a1.1 1.1 0 0 1-1.8.86L8 16H5.5A1.5 1.5 0 0 1 4 14.5v-5Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/><path d="M18.8 6a8.5 8.5 0 0 1 0 12" stroke="currentColor" stroke-width="2.2" fill="none" stroke-linecap="round"/></svg>',
    turtle: '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="11" cy="13" rx="7" ry="5"/><circle cx="19.5" cy="12" r="2.5"/><rect x="5" y="16" width="3" height="4" rx="1.5"/><rect x="13" y="16" width="3" height="4" rx="1.5"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    logo: '<svg viewBox="0 0 64 64"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fdc1f"/><stop offset="1" stop-color="#46a302"/></linearGradient></defs><rect x="2" y="2" width="60" height="60" rx="18" fill="url(#lg)"/><path d="M14 22c6-3 12-3 18 1 6-4 12-4 18-1v24c-6-3-12-3-18 1-6-4-12-4-18-1z" fill="#fff"/><path d="M32 23v24" stroke="#46a302" stroke-width="2.5"/><path d="M45 9a8 8 0 1 0 6 13 6.5 6.5 0 1 1-6-13z" fill="#ffc800"/></svg>',
  };
  W.html = (s) => { const d = document.createElement('div'); d.innerHTML = s; return d.firstChild; };
  W.sayBtn = (getText, lang, cls) => {
    const b = W.h('button.say' + (cls ? '.' + cls : ''), { 'aria-label': W.t('listenAyah'), html: W.icon.speaker });
    b.addEventListener('click', (e) => { e.stopPropagation(); W.speak(typeof getText === 'function' ? getText() : getText, lang || 'ar', { el: b }); });
    return b;
  };
  W.toast = (msg, ms) => {
    const t = W.$('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('on'), ms || 3200);
  };

  /* ---------------- Text-to-speech ---------------- */
  const synth = window.speechSynthesis;
  let voices = [];
  const loadVoices = () => { voices = synth ? synth.getVoices() : []; };
  if (synth) { loadVoices(); synth.onvoiceschanged = loadVoices; }
  const LANGS = { ar: ['ar-SA', 'ar'], fr: ['fr-FR', 'fr'], en: ['en-US', 'en-GB', 'en'] };
  const voiceFor = (lang) => {
    if (!voices.length) loadVoices();
    const prefs = LANGS[lang] || [lang];
    const score = (v) => (/(natural|premium|enhanced|neural|google|siri)/i.test(v.name) ? 2 : 0) + (v.localService ? 1 : 0);
    for (const p of prefs) {
      const c = voices.filter((v) => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith(p.toLowerCase()));
      if (c.length) return c.sort((a, b) => score(b) - score(a))[0];
    }
    return null;
  };
  let warned = false, curBtn = null;
  // Cleans a display string into something speakable
  W.speakable = (s) => String(s || '')
    .replace(/\([^)]*\)/g, ' ').replace(/[+…\.]{1,}$/g, '').replace(/\+/g, '')
    .replace(/[←→↔]/g, ' ').replace(/\s[-–—]\s/g, '، ').replace(/ـ/g, '').replace(/\s+/g, ' ').trim();
  W.speak = (text, lang, opt) => {
    opt = opt || {};
    lang = lang || 'ar';
    if (!synth || !text) return Promise.resolve();
    const v = voiceFor(lang);
    if (!v && lang === 'ar' && !warned) { warned = true; W.toast(W.t('noVoice'), 6000); }
    if (!opt.queue) synth.cancel();
    if (curBtn) curBtn.classList.remove('playing');
    const u = new SpeechSynthesisUtterance(lang === 'ar' ? W.speakable(text) : String(text).replace(/\([^)]*\)/g, ' ').replace(/[\[\]]/g, ''));
    u.lang = v ? v.lang : (LANGS[lang] || [lang])[0];
    if (v) u.voice = v;
    u.rate = opt.rate || (lang === 'ar' ? 0.8 : 0.95);
    const el = opt.el; if (el) { el.classList.add('playing'); curBtn = el; }
    return new Promise((res) => {
      let done = false;
      const end = () => { if (done) return; done = true; if (el) el.classList.remove('playing'); res(); };
      u.onend = end; u.onerror = end;
      setTimeout(end, 12000);
      // Chrome bug: speaking immediately after cancel() can be dropped
      setTimeout(() => synth.speak(u), 30);
    });
  };
  W.stopSpeak = () => { if (synth) synth.cancel(); };

  /* ---------------- SFX (WebAudio, no files) ---------------- */
  let actx = null;
  const ac = () => (actx = actx || new (window.AudioContext || window.webkitAudioContext)());
  const tone = (f, t0, d, type, g) => {
    const c = ac(); const o = c.createOscillator(); const v = c.createGain();
    o.type = type || 'sine'; o.frequency.value = f;
    v.gain.setValueAtTime(0, c.currentTime + t0);
    v.gain.linearRampToValueAtTime(g || 0.16, c.currentTime + t0 + 0.01);
    v.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t0 + d);
    o.connect(v).connect(c.destination); o.start(c.currentTime + t0); o.stop(c.currentTime + t0 + d + 0.02);
  };
  W.sfx = {
    ok() { try { tone(784, 0, 0.14, 'triangle'); tone(1175, 0.09, 0.22, 'triangle'); } catch (e) {} },
    ko() { try { tone(220, 0, 0.18, 'square', 0.07); tone(165, 0.1, 0.25, 'square', 0.07); } catch (e) {} },
    tap() { try { tone(600, 0, 0.05, 'sine', 0.06); } catch (e) {} },
    win() { try { [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.11, 0.3, 'triangle', 0.14)); } catch (e) {} },
    flip() { try { tone(440, 0, 0.06, 'sine', 0.05); tone(660, 0.04, 0.06, 'sine', 0.05); } catch (e) {} },
  };

  /* ---------------- confetti ---------------- */
  W.confetti = () => {
    const cv = W.h('canvas.confetti'); document.body.append(cv);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = innerWidth * dpr; cv.height = innerHeight * dpr;
    const c = cv.getContext('2d'); c.scale(dpr, dpr);
    const cols = ['#58cc02', '#1cb0f6', '#ffc800', '#ff4b4b', '#ce82ff', '#ff9600'];
    const P = Array.from({ length: 140 }, () => ({ x: innerWidth / 2 + (Math.random() - 0.5) * 80, y: innerHeight * 0.35, vx: (Math.random() - 0.5) * 13, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 4, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3, c: cols[(Math.random() * cols.length) | 0] }));
    let f = 0;
    (function loop() {
      c.clearRect(0, 0, innerWidth, innerHeight);
      for (const p of P) { p.vy += 0.38; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.a += p.va; c.save(); c.translate(p.x, p.y); c.rotate(p.a); c.fillStyle = p.c; c.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); c.restore(); }
      if (++f < 150) requestAnimationFrame(loop); else cv.remove();
    })();
  };

  /* ---------------- data ---------------- */
  const cache = {};
  W.load = (name) => (cache[name] = cache[name] || fetch('data/' + name + '.json').then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); }).catch(() => null));

  /* ---------------- router ---------------- */
  const routes = [];
  W.route = (re, fn) => routes.push([re, fn]);
  W.go = (hash) => { if (location.hash === hash) W.render(); else location.hash = hash; };
  W.render = () => {
    const hash = location.hash.slice(1) || '/';
    for (const [re, fn] of routes) {
      const m = re.exec(hash);
      if (m) { W.stopSpeak(); fn(...m.slice(1)); return; }
    }
    W.go('#/');
  };
  W.mount = (node, opt) => {
    const v = W.$('#view');
    v.replaceChildren(node);
    if (!(opt && opt.keepScroll)) window.scrollTo(0, 0);
    W.updateNav && W.updateNav();
  };
})();
