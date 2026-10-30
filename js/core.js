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
      g_flash: 'Flashcards', g_flash_d: 'Retourne la carte et note si tu t’en souvenais.',
      g_hear: 'Tape ce que tu entends', g_hear_d: 'Écoute 3 mots et remets-les dans l’ordre.',
      g_trans: 'Comment dit-on ?', g_trans_d: 'Trouve le mot en arabe, puis son sens en français.',
      g_pairs: 'Appuie sur les paires', g_pairs_d: 'Relie chaque mot arabe à son sens.',
      g_exam: 'Examen final', g_exam_d: 'Tous les mots, tous les jeux. Réussi dès 80 %.',
      g_guided: 'Lecture guidée', g_guided_d: 'Toute la page, dans l’ordre du livre.',
      g_listen: 'Qu’entends-tu ?', g_listen_d: 'Écoute et choisis ce que tu entends.',
      g_lpairs: 'Son ↔ écriture', g_lpairs_d: 'Relie chaque son à son écriture.',
      g_write: 'Écriture', g_write_d: 'Trace les lettres et les mots modèles.',
      rulesTitle: 'Règles du jeu', go: 'C’est parti !', check: 'Valider', cont: 'Continuer', skip: 'Passer', quit: 'Quitter',
      great: ['Excellent !', 'Bravo !', 'Super !', 'Parfait !', 'Bien joué !'], wrong: 'Pas tout à fait…', correctAns: 'Bonne réponse :',
      howSay: 'Comment dit-on « {w} » ?', whatMeans: 'Que veut dire ce mot ?', whatHear: 'Qu’entends-tu ?', tapHear: 'Tape ce que tu entends', tapPairs: 'Appuie sur les paires',
      showAns: 'Retourner', tapToFlip: 'Touche pour retourner',
      r_fail: 'Échec', r_hard: 'Difficile', r_good: 'Bon', r_easy: 'Facile',
      done: 'Partie terminée !', examPass: 'Leçon validée :', examFail: 'Pas encore validée :',
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
      refrain: 'Refrain', refrainHint: 'Ce verset est suivi de : « Alors, lequel des bienfaits de votre Seigneur nierez-vous tous deux ? »', listenAyah: 'Écouter',
      readPart1: '1ʳᵉ partie — les lettres', readPart2: '2ᵉ partie — lecture', readIntro: 'L’alphabet', readSurahs: 'Sourates & invocations',
      page: 'page', writingPage: 'Page d’écriture', clear: 'Effacer', traceTip: 'Trace par-dessus le modèle avec ton doigt ou la souris.',
      b_letters: 'Les voyelles', b_syllables: 'Syllabes', b_words: 'Mots', b_sentences: 'Phrases', b_forms: 'Les formes', b_note: 'À retenir', b_table: 'Tableau', b_other: 'Remarque', b_text: 'Texte',
      formsLbl: ['Au début', 'Au milieu', 'À la fin', 'Tout seul'],
      readTap: 'Touche chaque élément pour l’écouter, dans l’ordre.', nextBlock: 'Suite', listenAll: 'Tout écouter',
      unitOf: 'Unité', lessonN: 'Leçon {n}', wordsN: '{n} mots',
      tags: { mg: 'masc.', fg: 'fém.', 'mg/fg': 'masc./fém.', dl: 'duel', 'for br.pl': 'pl. brisé' },
      rules: {
        flash: ['Regarde le mot arabe et essaie de te souvenir de son sens.', 'Touche la carte pour la retourner, puis note-toi honnêtement.', 'Échec : la carte revient tout de suite. Difficile : elle revient plus loin dans la partie.', 'Bon : à revoir dans 3 jours. Facile : dans 10 jours. Tu les retrouves dans « Réviser ».'],
        hear: ['Écoute une courte suite de 2 ou 3 mots arabes de la leçon.', 'Touche les mots dans l’ordre où tu les entends : le premier se place à droite.', 'Les mots sont écrits en entier, avec leurs voyelles.', 'Haut-parleur : réécouter. Escargot : écouter plus lentement.'],
        trans: ['Une question sur deux : « Comment dit-on… ? » : trouve le mot en arabe.', 'L’autre : un mot arabe s’affiche, trouve ce qu’il veut dire.', 'Choisis la bonne réponse puis valide.', 'Tous les mots de la leçon y passent.'],
        pairs: ['Touche un mot arabe puis son sens.', 'À chaque paire trouvée, tu entends le mot.', 'Une erreur ? Les deux cases tremblent, réessaie.', 'Trouve toutes les paires pour finir la manche.'],
        exam: ['Une question par mot de la leçon, tous les types mélangés.', 'Pas de vies : tu vas jusqu’au bout.', 'Règle unique : la leçon est validée à partir de 80 % de bonnes réponses (16 sur 20).', 'Ton dernier score reste affiché sur la leçon.'],
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
      g_hear: 'Tap what you hear', g_hear_d: 'Hear 3 words and put them in order.',
      g_trans: 'How do you say…?', g_trans_d: 'Find the word in Arabic, then its meaning in English.',
      g_pairs: 'Tap the pairs', g_pairs_d: 'Match each Arabic word with its meaning.',
      g_exam: 'Final exam', g_exam_d: 'All the words, all the games. Passed from 80%.',
      g_guided: 'Guided reading', g_guided_d: 'The whole page, in the book’s order.',
      g_listen: 'What do you hear?', g_listen_d: 'Listen and pick what you hear.',
      g_lpairs: 'Sound ↔ writing', g_lpairs_d: 'Match each sound with its writing.',
      g_write: 'Writing', g_write_d: 'Trace the model letters and words.',
      rulesTitle: 'How to play', go: 'Let’s go!', check: 'Check', cont: 'Continue', skip: 'Skip', quit: 'Quit',
      great: ['Excellent!', 'Great job!', 'Awesome!', 'Perfect!', 'Well done!'], wrong: 'Not quite…', correctAns: 'Correct answer:',
      howSay: 'How do you say “{w}”?', whatMeans: 'What does this word mean?', whatHear: 'What do you hear?', tapHear: 'Tap what you hear', tapPairs: 'Tap the pairs',
      showAns: 'Flip', tapToFlip: 'Tap to flip',
      r_fail: 'Fail', r_hard: 'Hard', r_good: 'Good', r_easy: 'Easy',
      done: 'Game complete!', examPass: 'Lesson passed:', examFail: 'Not passed yet:',
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
      refrain: 'Refrain', refrainHint: 'This verse is followed by: “So which of the favors of your Lord will you both deny?”', listenAyah: 'Listen',
      readPart1: 'Part 1 — the letters', readPart2: 'Part 2 — reading', readIntro: 'The alphabet', readSurahs: 'Surahs & invocations',
      page: 'page', writingPage: 'Writing page', clear: 'Clear', traceTip: 'Trace over the model with your finger or mouse.',
      b_letters: 'The vowels', b_syllables: 'Syllables', b_words: 'Words', b_sentences: 'Sentences', b_forms: 'Letter forms', b_note: 'Remember', b_table: 'Table', b_other: 'Note', b_text: 'Text',
      formsLbl: ['Beginning', 'Middle', 'End', 'On its own'],
      readTap: 'Tap each item to hear it, in order.', nextBlock: 'Next', listenAll: 'Listen to all',
      unitOf: 'Unit', lessonN: 'Lesson {n}', wordsN: '{n} words',
      tags: { mg: 'masc.', fg: 'fem.', 'mg/fg': 'masc./fem.', dl: 'dual', 'for br.pl': 'broken pl.' },
      rules: {
        flash: ['Look at the Arabic word and try to recall its meaning.', 'Tap the card to flip it, then rate yourself honestly.', 'Fail: the card comes back right away. Hard: it comes back later in the game.', 'Good: review in 3 days. Easy: in 10 days. You will find them in “Review”.'],
        hear: ['Listen to a short sequence of 2 or 3 Arabic words from the lesson.', 'Tap the words in the order you hear them: the first one goes on the right.', 'Words are written in full, with their vowels.', 'Speaker: replay. Snail: listen more slowly.'],
        trans: ['Every other question: “How do you say…?”: find the word in Arabic.', 'The other: an Arabic word appears, find what it means.', 'Pick the right answer, then check.', 'Every word of the lesson comes up.'],
        pairs: ['Tap an Arabic word, then its meaning.', 'Each time you match a pair, you hear the word.', 'A mistake? Both tiles shake — try again.', 'Find all the pairs to finish the round.'],
        exam: ['One question per word of the lesson, all types mixed.', 'No lives: you go all the way to the end.', 'One rule: the lesson is passed from 80% right answers (16 out of 20).', 'Your last score stays on the lesson.'],
        guided: ['We follow the book page from top to bottom.', 'Tap each item to hear it, then repeat it out loud.', 'After each block: a short listening question.', 'Go all the way to the end of the page!'],
        listen: ['Listen to the sound.', 'Pick what you heard.', 'Tap the speaker to replay.', 'Check your answer.'],
        lpairs: ['Blue tiles are sounds: tap them to listen.', 'Match each sound with its writing.', 'Find all the pairs to finish.'],
        write: ['This is the book’s writing page.', 'Trace each letter over the model, from right to left.', 'Then copy the model words.', 'Clear and start again as often as you like.'],
      },
    },
  };

  const STR2 = {
    fr: {
      tab_learn: 'Apprendre', tab_review: 'Réviser', tab_lexicon: 'Lexique',
      hello: 'Salam !', homeSub: 'Que veux-tu apprendre aujourd’hui ?',
      resume: 'Reprendre', welcome: 'Bienvenue sur Wakf', welcomeSub: 'Débutant ? Commence par apprendre les lettres.', startReading: 'Commencer à lire',
      rubrics: 'Les rubriques', ctaStart: 'Commencer', ctaContinue: 'Continuer {x}', soonAvail: 'Bientôt disponible',
      progLessons: '{a} / {b} leçons terminées', progSurah: '{a} / {b} sourates ouvertes', progRead: '{a} / {b} pages lues',
      chip_surah: 'Sourates', chip_w85: 'Coran', chip_read: 'Lecture', chip_w1000: 'Vocabulaire',
      settings: 'Réglages', language: 'Langue', languageSub: 'Langue de tout le site', install: 'Installer l’application', installSub: 'Sur l’écran d’accueil, utilisable hors-ligne', installed: 'Application installée',
      resetProgress: 'Réinitialiser la progression', resetSub: 'Efface les leçons terminées et les mots à réviser', resetTitle: 'Réinitialiser la progression ?', resetText: 'Les leçons terminées, les derniers scores et les mots à réviser seront effacés de ce navigateur.', erase: 'Effacer', cancel: 'Annuler', close: 'Fermer', done2: 'C’est fait',
      installHelp: 'iPhone : Partager puis « Sur l’écran d’accueil ». Android ou PC : menu du navigateur puis « Installer l’application ».',
      quitTitle: 'Quitter le jeu ?', quitText: 'Ta progression dans ce jeu sera perdue.', stay: 'Rester', quit: 'Quitter',
      reviewTitle: 'Réviser', reviewDue: 'mots à revoir aujourd’hui', reviewStart: 'Réviser {n} mots', reviewStart1: 'Réviser 1 mot', reviewEmpty: 'Rien à réviser pour l’instant', reviewEmptySub: 'Les mots ratés dans les jeux et ceux que tu notes dans les flashcards apparaîtront ici, au bon moment.', reviewLater: 'Prochaines révisions', reviewSoon: 'Plus tard : {n} mots',
      lexTitle: 'Lexique', lexPh: 'Chercher un mot (français ou arabe)…', lexHint: 'Cherche dans tous les mots du site, en arabe ou en français.', lexNone: 'Aucun mot trouvé pour « {q} ».', lexCount: '{n} résultats', lexCount1: '1 résultat', lexTry: 'Essaie :',
      inLesson: '{r} · leçon {n}', right: 'Bonnes réponses', accuracy: 'Précision', time: 'Temps', streakN: '{n} d’affilée',
      backLbl: 'Retour', settingsLbl: 'Ouvrir les réglages', listen: 'Écouter', listenSlow: 'Écouter lentement',
      surahSections: '{n} sections', unitOf: 'Unité', lessonsWord: 'leçons', short_w85: '85 %', short_w1000: '1000 mots',
    },
    en: {
      tab_learn: 'Learn', tab_review: 'Review', tab_lexicon: 'Lexicon',
      hello: 'Salam!', homeSub: 'What do you want to learn today?',
      resume: 'Continue', welcome: 'Welcome to Wakf', welcomeSub: 'New to Arabic? Start by learning the letters.', startReading: 'Start reading',
      rubrics: 'Sections', ctaStart: 'Start', ctaContinue: 'Continue {x}', soonAvail: 'Coming soon',
      progLessons: '{a} / {b} lessons completed', progSurah: '{a} / {b} surahs opened', progRead: '{a} / {b} pages read',
      chip_surah: 'Surahs', chip_w85: 'Quran', chip_read: 'Reading', chip_w1000: 'Vocabulary',
      settings: 'Settings', language: 'Language', languageSub: 'Language of the whole site', install: 'Install the app', installSub: 'On your home screen, works offline', installed: 'App installed',
      resetProgress: 'Reset progress', resetSub: 'Erases completed lessons and words to review', resetTitle: 'Reset your progress?', resetText: 'Completed lessons, last scores and words to review will be erased from this browser.', erase: 'Erase', cancel: 'Cancel', close: 'Close', done2: 'Done',
      installHelp: 'iPhone: Share then “Add to Home Screen”. Android or PC: browser menu then “Install app”.',
      quitTitle: 'Quit the game?', quitText: 'Your progress in this game will be lost.', stay: 'Stay', quit: 'Quit',
      reviewTitle: 'Review', reviewDue: 'words to review today', reviewStart: 'Review {n} words', reviewStart1: 'Review 1 word', reviewEmpty: 'Nothing to review yet', reviewEmptySub: 'Words you miss in games and the ones you rate in flashcards will show up here, at the right time.', reviewLater: 'Upcoming reviews', reviewSoon: 'Later: {n} words',
      lexTitle: 'Lexicon', lexPh: 'Search a word (English or Arabic)…', lexHint: 'Search every word on the site, in Arabic or in English.', lexNone: 'No word found for “{q}”.', lexCount: '{n} results', lexCount1: '1 result', lexTry: 'Try:',
      inLesson: '{r} · lesson {n}', right: 'Right answers', accuracy: 'Accuracy', time: 'Time', streakN: '{n} in a row',
      backLbl: 'Back', settingsLbl: 'Open settings', listen: 'Listen', listenSlow: 'Listen slowly',
      surahSections: '{n} sections', unitOf: 'Unit', lessonsWord: 'lessons', short_w85: '85%', short_w1000: '1000 words',
    },
  };
  for (const l in STR2) Object.assign(STR[l], STR2[l]);
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
  const DEF = { lang: null, lessons: {}, srs: {}, last: {}, opened: {}, readPages: {} };
  let S;
  try { S = Object.assign({}, DEF, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) { S = Object.assign({}, DEF); }
  // drop the old gamification fields (XP, streak, daily goal…)
  ['xp', 'daily', 'streak', 'seen'].forEach((k) => delete S[k]);
  for (const id in S.srs) { const r = S.srs[id]; if (r && r.due == null) S.srs[id] = { b: r.b || 0, due: r.t || Date.now() }; }
  W.state = S;
  W.save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  W.save();
  W.lessonState = (id) => (S.lessons[id] = S.lessons[id] || { games: {}, exam: null });
  W.markGame = (id, g, score) => { const L = W.lessonState(id); if (g === 'exam') { L.exam = score; L.examBest = Math.max(L.examBest || 0, score); } else L.games[g] = 1; W.save(); };
  W.setLast = (theme, rec) => { S.last[theme] = Object.assign({ at: Date.now() }, rec); S.last._ = theme; W.save(); };
  W.markOpened = (key) => { if (!S.opened[key]) { S.opened[key] = Date.now(); W.save(); } };
  const DAY = 864e5;
  /* ---------- spaced repetition memory (one record per word, shared by every game) ----------
     s: strength 0..7 · due: next review timestamp · lapses: times forgotten · n: answers seen · last: last seen */
  const MIN = 6e4;
  const IV = [0, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 16 * DAY, 35 * DAY, 75 * DAY]; // interval by strength
  const memOf = (id) => S.srs[id] || (S.srs[id] = { s: 0, due: 0, lapses: 0, n: 0, last: 0, isNew: true });
  for (const id in S.srs) { const r = S.srs[id]; if (r.s == null) S.srs[id] = { s: r.b || 0, due: r.due || 0, lapses: r.b ? 0 : 1, n: 1, last: r.due || 0 }; }
  const jitter = (ms) => ms * (0.85 + Math.random() * 0.3); // avoid every word coming back at the same minute
  W.memAnswer = (id, ok) => {
    if (!id) return; const m = memOf(id), now = Date.now();
    delete m.isNew; m.n++; m.last = now;
    if (ok) { m.s = Math.min(7, m.s + 1); m.due = now + jitter(IV[m.s]); }
    else { m.lapses++; m.s = Math.max(0, m.s - 2); m.due = now; }
    W.save();
  };
  // flashcards: 0 fail · 1 hard · 2 good · 3 easy
  W.srsRate = (id, r) => {
    const m = memOf(id), now = Date.now(); delete m.isNew; m.n++; m.last = now;
    if (r === 0) { m.lapses++; m.s = Math.max(0, m.s - 2); m.due = now; }
    else if (r === 1) { m.s = Math.max(1, m.s); m.due = now + jitter(DAY); }
    else if (r === 2) { m.s = Math.min(7, Math.max(m.s + 1, 3)); m.due = now + jitter(IV[m.s]); }
    else { m.s = Math.min(7, Math.max(m.s + 2, 5)); m.due = now + jitter(IV[m.s]); }
    W.save();
  };
  W.srsMiss = (id) => W.memAnswer(id, false);
  W.mem = (id) => S.srs[id] || null;
  // need for practice: high = should come back now (weak, forgotten, overdue), low = well known
  W.memNeed = (id) => {
    const m = S.srs[id]; if (!m || !m.n) return 2.2; // never seen
    const now = Date.now();
    const overdue = m.due <= now ? 1 + Math.min(2, (now - m.due) / Math.max(IV[m.s] || DAY, DAY)) : 0.25 * Math.max(0, 1 - (m.due - now) / Math.max(IV[m.s], MIN));
    return Math.max(0.05, (7 - m.s) / 7 * 2 + Math.min(2, m.lapses * 0.5) + overdue);
  };
  W.memKnown = (id) => { const m = S.srs[id]; return !!m && m.s >= 4 && m.due > Date.now(); };
  W.dueIds = () => { const now = Date.now(); return Object.keys(S.srs).filter((k) => { const m = S.srs[k]; return m.n && m.due <= now && (m.lapses > 0 || m.s >= 2); }); };
  W.resetAll = () => { const l = S.lang; for (const k in S) delete S[k]; Object.assign(S, JSON.parse(JSON.stringify(DEF)), { lang: l }); W.save(); };

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
  W.icon = new Proxy({}, { get: (_, k) => W.svg(k === 'turtle' ? 'slow' : k) });
  W.html = (s) => { const d = document.createElement('div'); d.innerHTML = s; return d.firstChild; };
  W.sayBtn = (getText, key, cls) => {
    const b = W.h('button.say' + (cls ? '.' + cls : ''), { 'aria-label': W.t('listen'), html: W.svg('speaker') });
    b.addEventListener('click', (e) => { e.stopPropagation(); W.say(typeof getText === 'function' ? getText() : getText, key && key !== 'ar' ? key : null, { el: b }); });
    return b;
  };
  // In-app dialog (replaces confirm()). Resolves true/false.
  W.dialog = ({ title, text, icon, ok, cancel, danger, color }) => new Promise((res) => {
    const prev = document.activeElement;
    const close = (v) => { scrim.remove(); document.removeEventListener('keydown', onKey, true); prev && prev.focus && prev.focus(); res(v); };
    const onKey = (e) => { if (e.key === 'Escape') { e.stopPropagation(); close(false); } };
    const okB = W.h('button.btn' + (danger ? '.red' : ''), { on: { click: () => close(true) } }, ok || W.t('cont'));
    const box = W.h('div.dialog', { role: 'alertdialog', 'aria-modal': 'true', style: color ? { '--c': 'var(--' + color + ')', '--l': 'var(--' + color + '-l)' } : null },
      icon ? W.h('div.di', { html: W.svg(icon) }) : null, W.h('h2', null, title), text ? W.h('p', null, text) : null,
      W.h('div.acts', null, cancel !== false ? W.h('button.btn.outline', { on: { click: () => close(false) } }, cancel || W.t('cancel')) : null, okB));
    const scrim = W.h('div.scrim', { on: { click: (e) => { if (e.target === scrim) close(false); } } }, box);
    document.body.append(scrim); document.addEventListener('keydown', onKey, true);
    setTimeout(() => okB.focus(), 50);
  });
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
    if (!v && lang === 'ar' && !warned) { warned = true; let seen = false; try { seen = sessionStorage.getItem('wakf.novoice') === '1'; sessionStorage.setItem('wakf.novoice', '1'); } catch (e) {} if (!seen) W.toast(W.t('noVoice'), 4500); }
    if (!opt.queue) synth.cancel();
    if (curBtn) curBtn.classList.remove('playing');
    const u = new SpeechSynthesisUtterance(lang === 'ar' ? W.speakable(text) : String(text).replace(/\([^)]*\)/g, ' ').replace(/[\[\]]/g, ''));
    u.lang = v ? v.lang : (LANGS[lang] || [lang])[0];
    if (v) { try { u.voice = v; } catch (e) {} }
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
  W.stopSpeak = () => { if (synth) synth.cancel(); if (curAudio) { curAudio.pause(); curAudio = null; } };
  /* Recorded audio first (audio/<key>.mp3, listed in data/audio.json), speech synthesis as fallback */
  let audioIndex = null, curAudio = null;
  const loadAudioIndex = () => audioIndex || (audioIndex = fetch('data/audio.json').then((r) => (r.ok ? r.json() : { files: [] })).then((j) => new Set(j.files || [])).catch(() => new Set()));
  W.say = async (text, key, opt) => {
    opt = opt || {};
    const idx = await loadAudioIndex();
    if (key && idx.has(key)) {
      if (synth) synth.cancel();
      if (curAudio && !opt.queue) curAudio.pause();
      const a = new Audio('audio/' + key + '.mp3'); curAudio = a;
      if (opt.rate) a.playbackRate = opt.rate;
      const el = opt.el; if (el) el.classList.add('playing');
      return new Promise((res) => { const end = () => { if (el) el.classList.remove('playing'); res(); }; a.onended = end; a.onerror = () => { end(); }; a.play().catch(() => { end(); W.speak(text, 'ar', opt); }); });
    }
    return W.speak(text, 'ar', opt);
  };
  W.hasAudio = async (key) => (await loadAudioIndex()).has(key);

  /* ---------------- Quran.com recitation (one reciter everywhere: Mishari al-Afasy) ---------------- */
  const pad3 = (n) => String(n).padStart(3, '0');
  W.QURAN_RECITER = 'Alafasy';
  W.verseAudio = (s, a) => 'https://verses.quran.com/' + W.QURAN_RECITER + '/mp3/' + pad3(s) + pad3(a) + '.mp3';
  W.wordAudio = (s, a, w) => 'https://audio.qurancdn.com/wbw/' + pad3(s) + '_' + pad3(a) + '_' + pad3(w) + '.mp3';
  let qToken = 0, qBtn = null;
  W.stopQuran = () => { qToken++; if (curAudio) curAudio.pause(); if (qBtn) qBtn.classList.remove('playing'); qBtn = null; };
  // plays the urls one after the other; if the first file cannot be played (offline), runs fallback()
  W.playUrls = (urls, opt) => {
    opt = opt || {};
    W.stopQuran(); if (synth) synth.cancel();
    const tok = qToken, list = urls.filter(Boolean); let i = 0, played = false;
    const el = opt.el; if (el) { el.classList.add('playing'); qBtn = el; }
    return new Promise((res) => {
      const done = () => { if (tok === qToken && el) el.classList.remove('playing'); res(); };
      const next = () => {
        if (tok !== qToken) return res();
        if (i >= list.length) return done();
        const a = new Audio(list[i++]); curAudio = a;
        a.onended = next;
        a.onerror = () => { if (!played && opt.fallback) { done(); opt.fallback(); } else next(); };
        a.play().then(() => { played = true; }).catch(() => { if (!played && opt.fallback) { done(); opt.fallback(); } else next(); });
      };
      next();
    });
  };

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
  W._seq = 0;
  W.render = () => {
    const hash = location.hash.slice(1) || '/';
    const tok = ++W._seq;
    document.querySelectorAll('.scrim').forEach((x) => x.remove());
    for (const [re, fn] of routes) {
      const m = re.exec(hash);
      if (m) { W.stopSpeak(); fn(tok, ...m.slice(1)); return; }
    }
    W.go('#/');
  };
  // Mount a page; ignored if the user already navigated elsewhere (stale async render)
  W.mount = (node, tok) => {
    if (tok !== undefined && tok !== W._seq) return false;
    const v = W.$('#view');
    v.replaceChildren(node);
    window.scrollTo(0, 0);
    W.updateNav && W.updateNav();
    return true;
  };
})();
