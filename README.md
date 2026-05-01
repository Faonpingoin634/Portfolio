# Portfolio — Louka Avenia

Site vitrine personnel présentant mes projets, compétences et services freelance.

**Live :** [louka-avenia.me](https://www.louka-avenia.me)

---

## Architecture

Projet **vanilla** sans framework ni build tool — HTML, CSS et JS natifs, servi directement en statique sur **Vercel**.

```
Portfolio/
├── index.html               # Page principale (toutes sections)
├── style.css                # Styles globaux + variables CSS (thème clair/sombre)
├── main.js                  # Source JS (6 classes, Facade Pattern)
├── main.min.js              # JS minifié via terser (-35%)
├── robots.txt               # Directives SEO crawl
├── sitemap.xml              # Plan du site (12 URLs)
├── vercel.json              # Config Vercel (cleanUrls, headers sécurité, cache)
├── 404.html                 # Page d'erreur personnalisée
├── wait_screen.html         # Page "bientôt disponible"
├── assets/
│   ├── logo.webp
│   ├── logo_onglets.webp
│   ├── moi.webp
│   ├── portfolio-preview.webp
│   ├── Waiting_sticker.webp
│   ├── CV Louka AVENIA Alternance.pdf
│   └── projet/              # Captures d'écran des projets (WebP)
├── projets/                 # Pages de détail de chaque projet
│   ├── api-react/
│   ├── bot-discord/
│   ├── dashboard/
│   ├── latelier-de-la-feve/
│   ├── maquette/
│   ├── pokedex/
│   ├── pokemon/
│   ├── portfolio/
│   ├── pygame/
│   └── shifumi/
└── mentions-legales/
```

---

## Fonctionnalités

### main.js — 6 classes (Facade Pattern)

| Classe | Rôle |
|---|---|
| `ThemeManager` | Bascule dark/light mode, persistance `localStorage`, détection thème système, `aria-checked` |
| `NavigationManager` | Menu burger mobile — ouverture/fermeture, blocage scroll, fermeture au clic extérieur et au resize |
| `ProjectFilter` | Filtrage des cartes projets par technologie (`data-tags`), message "aucun résultat" |
| `ContactForm` | Validation email temps réel (debounce 300ms), soumission async Formspree, honeypot anti-spam |
| `ScrollObserver` | Animations scroll via `IntersectionObserver`, effets stagger sur timeline et grille projets |
| `LightboxManager` | Zoom images — focus trap, restauration focus, `currentSrc` pour images WebP dans `<picture>` |

### Page principale (`index.html`)

- **Hero** — CTA vers les projets et téléchargement du CV
- **À propos** — Présentation + photo profil
- **3 derniers projets** — Cartes avec animation reveal
- **Parcours** — Timeline animée avec 6 entrées (formations + expériences)
- **Compétences** — Filtres interactifs (HTML, CSS, JS, React, PHP, Python, MySQL, Git, C++)
- **Grille de projets** — 10 projets filtrables par technologie (bento grid)
- **Approche freelance** — Section éditoriale
- **Contact** — Formulaire avec validation et envoi via Formspree
- **Footer** — Liens LinkedIn, GitHub, TikTok

### SEO

- Open Graph complet (`og:title`, `og:description`, `og:image`, `og:url`, `og:type`) sur toutes les pages
- `<link rel="canonical">` sur toutes les pages
- JSON-LD `Person` schema sur l'accueil
- JSON-LD `CreativeWork` schema sur les 10 pages projet
- Google Site Verification
- `robots.txt` + `sitemap.xml` avec `changefreq` et `priority`
- `<meta name="description">` sur toutes les pages

### Performance

- Images converties en **WebP** (logo -80%, preview -82%, sticker -86%, photo -45%)
- JS minifié : `main.js` → `main.min.js` via terser
- Google Fonts : `preconnect` + `preload` + poids limités (400/500/600)
- `loading="lazy"` sur toutes les images non critiques
- Cache long terme (`max-age=31536000`) sur assets via `vercel.json`
- `prefers-reduced-motion` respecté (désactive toutes les animations)
- `will-change` appliqué uniquement après déclenchement de l'animation

### Accessibilité

- Skip link "Aller au contenu principal"
- `:focus-visible` global (outline clavier visible)
- Burger menu `<button>` avec `aria-expanded`, `aria-label`, `aria-controls`
- Toggle thème avec `role="switch"` et `aria-checked`
- Lightbox avec `role="dialog"`, `aria-modal`, focus trap, restauration du focus
- `aria-live="polite"` sur le statut du formulaire de contact
- `<nav aria-label>` sur la navbar et les liens réseaux sociaux
- `@media (prefers-reduced-motion: reduce)` dans le CSS

### Thème

Variables CSS custom properties pour les deux thèmes, appliquées via la classe `.dark-mode` sur `<html>`. Le thème est initialisé **avant le chargement du CSS** (inline script dans `<head>`) pour éviter le flash.

---

## Projets présentés

| Projet | Stack |
|---|---|
| Portfolio Web | HTML, CSS, JS, Git |
| Paris Fraîcheur (React) | React, JS, CSS, Git |
| Bot Discord | Python, JSON, Git |
| Dashboard Studio Onyx | HTML, CSS, JS, PHP, JSON |
| L'Atelier de la Fève | HTML, CSS, JS, MySQL, Git |
| Site de maquettage | JS, HTML, CSS, Bootstrap, Git |
| Pokédex | HTML, CSS, Git |
| Moteur Pokémon C++ | C++, SFML, Git |
| Mini-Jeux Pygame | Python, Git |
| Shifumi PHP | PHP, HTML, CSS, JSON, Git |

---

## Maintenance

### Après modification de `main.js`
```bash
npx terser main.js --compress --mangle --output main.min.js
```

### Ajouter un projet
1. Créer `projets/mon-projet/index.html` (copier un existant comme template)
2. Ajouter JSON-LD `CreativeWork` + `og:title/description/image`
3. Ajouter la carte dans `index.html` section `#projects`
4. Ajouter l'URL dans `sitemap.xml`
5. Déposer une capture d'écran WebP dans `assets/projet/`
