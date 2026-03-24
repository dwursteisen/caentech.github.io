# caen.tech


## Installation

```bash
npm i
```

Sur VS Code, installer le [plugin **Astro** de astro.build](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).

## Commandes

| Commande | Effet |
| --- | --- |
| `npm run dev` | Serveur local sur `http://localhost:4321` avec hot-reload |
| `npm run build` | Génère le site statique dans `dist/` |
| `npm run preview` | Sert `dist/` localement pour vérifier le build |

## Où sont les données

Tout le contenu est dans **`src/data/*.json`** :

- **Données communes** — `site.json`
- **Programme** — `program.json`, `speakers.json`, `rooms.json`
- **À propos** — `partners.json`, `team.json`
- **Sponsors** — `sponsors.json`
- **Podcasts** — `podcasts.json`
- **Infos pratiques** — `faq.json`

Pour modifier du contenu, **éditer directement le fichier JSON** correspondant. Les schémas Zod dans `src/content.config.ts` valident qu'ils ont la bonne structure.

## Où sont les images

Les images sont dans **`public/images/`**. Tout ce qui est dans `public/` est copié tel quel dans `dist/` au build — **Astro ne redimensionne ni n'optimise les images**. Il faut donc les préparer **avant** de les ajouter au repo :

- Formats préférés : **SVG** et **WebP**.
- Redimensionner au **format d'affichage × 2** (retina) avant ajout.
- Compresser le WebP à qualité ~80.

## Structure des pages

Chaque fichier dans **`src/pages/`** = une page du site. Le chemin du fichier donne l'URL :

- `src/pages/index.astro` → `/`
- `src/pages/a-propos.astro` → `/a-propos`
- `src/pages/programme.astro` → `/programme`

Les pages utilisent un layout commun (`src/layouts/BaseLayout.astro`) et importent les données JSON + les composants (`src/components/`).

## Le résultat du build

`npm run build` produit un dossier **`dist/`** contenant uniquement des fichiers statiques (HTML, CSS, JS, images).

## Fichiers `.astro`

Exemple :

```astro
---
// Partie "frontmatter" : du TypeScript exécuté au build uniquement.
// Imports, fetch de données, logique de préparation.
import BaseLayout from '../layouts/BaseLayout.astro'
const title = 'Ma page'
---

<!-- Partie template : du HTML classique avec des expressions {} -->
<BaseLayout {title}>
  <h1>{title}</h1>
</BaseLayout>

<style>
  /* CSS scopé : ces règles ne s'appliquent qu'à CE composant */
  h1 { color: red; }
</style>
```

Points clés :

- Le **frontmatter** (`---`) tourne côté serveur au moment du build. Rien de ce code n'arrive dans le navigateur.
- Le **`<style>`** est **scopé par défaut** : les sélecteurs ne débordent pas sur les autres composants. Astro ajoute automatiquement un attribut unique pour l'isolation.
- Pour du CSS global (ex. reset, variables), utiliser `<style is:global>` ou un fichier CSS importé.

## CSS

Le CSS vit à deux endroits :

- **Dans les composants `.astro`** : balise `<style>` scopée par défaut (voir section précédente). Chaque composant encapsule ses propres styles.
- **Dans des fichiers `.css`** (dans `src/styles/`) : styles globaux, design tokens (variables CSS), reset, etc. Ils sont importés dans le layout de base.

La convention de nommage des classes CSS est **Pleasant BEM** : https://paleo.paroi.tech/pleasant-bem.html
