# Wakf — apprendre l’arabe (site web / PWA)

Site statique (HTML/CSS/JS, aucune dépendance, aucun build) prévu pour **GitHub Pages**.
Il est installable sur téléphone (PWA, hors-ligne) et s’adapte au PC pour les démos.

## Mise en ligne sur GitHub Pages
1. Pousser le contenu de ce dossier à la racine d’un repo (branche `main`).
2. Sur GitHub, aller dans **Settings → Pages → Build and deployment**, choisir **Deploy from a branch**, puis `main` / `/ (root)`.
3. Le site est en ligne sur `https://<compte>.github.io/<repo>/`. Tous les chemins sont relatifs, donc ça marche dans un sous-dossier.

## Après toute modification
Lancer `python3 tools/build_sw.py`. Ce script régénère `sw.js` (la liste des fichiers mis en cache et la version), sinon les téléphones gardent l’ancienne version.

## Structure
- `index.html`, `css/app.css` : l’interface (style inspiré des jeux d’apprentissage façon Duolingo).
- `js/core.js` : les textes FR/EN, la sauvegarde locale (XP, série, progression), la synthèse vocale, les sons et le routeur.
- `js/games.js` : le moteur des jeux (Flashcards, Appuie sur les paires, Comment dit-on ?, Tape ce que tu entends, Examen final).
- `js/reading.js` : la rubrique « Apprendre à lire » : le livre page par page, sans jeux (seules les pages pédagogiques sont gardées).
- `js/icons.js`, `js/brand.js`, `js/mmart.js` : icônes, logo, badges de jeux et illustrations des mind maps (SVG maison).
- `js/mindmap.js` : les mind maps des sourates, redessinées à partir des données.
- `js/app.js` : les écrans et la navigation.
- `data/*.json` : tous les contenus, retranscrits des ressources fournies.
  - `words85.json` : 85 % des mots du Coran : 390 noms et particules (leçons 1-20), 272 verbes avec leurs 6 formes (leçons 21-34), 28 verbes + préposition (leçons 35-36), et les tableaux de conjugaison.
  - `reading.json` : le livre « أتعلم العربية » (pages pédagogiques : p. 5-7, 29 leçons et pages d’écriture, textes, sourates et adhkar).
  - `rahman.json` : la mind map de la sourate Ar-Rahman.
  - `words1000.json` : les 1000 mots (50 leçons). Le champ `lesson` fixe la leçon de chaque mot : corriger un mot ne décale pas la progression.
  - `insan.json` : la mind map de la sourate Al-Insan.
- `assets/reading/` : les illustrations des leçons, recadrées du livre.

## Ajouter une sourate
Créer `data/<nom>.json` sur le modèle de `rahman.json` (deux onglets) ou `insan.json` (une seule carte), puis l’ajouter à `SURAHS` dans `js/app.js`.

## Audio
Le site lit d’abord les fichiers enregistrés du dossier `audio/` (listés dans `data/audio.json`), puis la synthèse vocale en secours. La liste et le nommage des 2 915 fichiers à enregistrer sont dans `AUDIO.md`. Après avoir ajouté des MP3 : `python3 tools/build_audio_index.py` puis `python3 tools/build_sw.py`.

## Mode démo (PC de l’institut)
Réglages → Mode démo → Oui. À chaque nouveau chargement de page, la progression est effacée et on revient au choix de la langue. Un bouton « Nouveau visiteur » apparaît en haut ; après 3 minutes sans activité, le site propose de repartir de zéro.

## Traductions à valider
Les traductions françaises des 85 %, des 1000 mots et des deux mind maps ont été faites à partir de l’anglais : elles portent `fr_status: "a_valider"` dans les données.
