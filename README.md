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
- `js/games.js` : le moteur des jeux (flashcards, tape ce que tu entends, traduction 50/50, paires, examen, qu’entends-tu ?).
- `js/reading.js` : la rubrique « Apprendre à lire » (le livre page par page, plus la lecture guidée et l’écriture).
- `js/mindmap.js` : les mind maps des sourates, redessinées à partir des données.
- `js/app.js` : les écrans et la navigation.
- `data/*.json` : tous les contenus, retranscrits des ressources fournies.
  - `words85.json` : 85 % des mots du Coran (390 entrées, 20 leçons de 20 mots).
  - `reading.json` : le livre « أتعلم العربية » (p. 5-7, 29 leçons, 2ᵉ partie, sourates et adhkar).
  - `rahman.json` : la mind map de la sourate Ar-Rahman.
  - `words1000.json` : **à remplir** avec la liste des 1000 mots (même format que `words85.json` : `n`, `ar`, `en`, `fr`). La rubrique s’active toute seule dès que la liste n’est plus vide.
- `assets/` : les illustrations recadrées du livre et de la mind map.

## Ajouter une sourate
Créer `data/<nom>.json` sur le modèle de `rahman.json`, puis l’ajouter à `SURAHS` dans `js/app.js`.

## Audio
La prononciation passe par la synthèse vocale de l’appareil (Web Speech API). Si aucune voix arabe n’est installée, un message l’indique à l’utilisateur.
