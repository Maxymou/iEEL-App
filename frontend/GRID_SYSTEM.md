# 📐 Grid System - Documentation

Système de grille CSS Grid responsive, mobile-first, cohérent et réutilisable.

---

## 🎯 Vue d'ensemble

Un système de grille professionnel basé sur **CSS Grid** (pas Flexbox) avec :

- ✅ **4 colonnes** (mobile)
- ✅ **8 colonnes** (tablet)
- ✅ **12 colonnes** (desktop)
- ✅ **Gutter 20px** (espacement entre colonnes)
- ✅ **Marges 20px** (safe area)
- ✅ **Type Stretch** (colonnes fluides avec `1fr`)
- ✅ **Mode debug** (overlay en dev)
- ✅ **Compatible thème clair** (futur)

---

## 📦 Installation

Le Grid System est déjà intégré ! Aucune installation nécessaire.

### Fichiers du système

```
frontend/
├── tailwind.config.js          # Tokens de grid (gutter, marges, colonnes)
├── src/
│   ├── index.css              # Variables CSS + debug mode
│   ├── components/
│   │   ├── GridContainer.jsx  # Conteneur de grille
│   │   └── GridItem.jsx       # Élément de grille
│   └── pages/
│       └── GridDemo.jsx       # Page de démonstration
```

---

## 🚀 Usage rapide

### 1. Import des composants

```jsx
import GridContainer from '../components/GridContainer';
import GridItem from '../components/GridItem';
```

### 2. Usage basique

```jsx
<GridContainer>
  <GridItem span={2}>
    Contenu sur 2 colonnes
  </GridItem>
  <GridItem span={2}>
    Contenu sur 2 colonnes
  </GridItem>
</GridContainer>
```

### 3. Usage responsive

```jsx
<GridContainer>
  <GridItem
    span={4}    // Mobile: 4 cols (100%)
    spanMd={4}  // Tablet: 4 cols (50%)
    spanLg={6}  // Desktop: 6 cols (50%)
  >
    Contenu responsive
  </GridItem>
</GridContainer>
```

---

## 📱 Breakpoints

| Breakpoint | Taille | Colonnes | Usage |
|------------|--------|----------|-------|
| **Mobile** | < 768px | **4** | Téléphones |
| **Tablet** | ≥ 768px | **8** | Tablettes |
| **Desktop** | ≥ 1024px | **12** | Ordinateurs |

---

## 🧩 Composants

### GridContainer

Conteneur principal de la grille.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | ReactNode | - | Éléments enfants (GridItem) |
| `className` | string | '' | Classes CSS additionnelles |
| `debug` | boolean | false | Active l'overlay de debug (dev only) |
| `as` | string | 'div' | Tag HTML à utiliser |

#### Exemple

```jsx
<GridContainer debug={true} className="my-custom-class">
  {/* GridItem ici */}
</GridContainer>
```

---

### GridItem

Élément de grille avec gestion du span responsive.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `span` | number | 1 | Colonnes mobile (1-4) |
| `spanMd` | number | - | Colonnes tablet (1-8) |
| `spanLg` | number | - | Colonnes desktop (1-12) |
| `start` | number | - | Position de départ mobile |
| `startMd` | number | - | Position de départ tablet |
| `startLg` | number | - | Position de départ desktop |
| `className` | string | '' | Classes CSS additionnelles |
| `as` | string | 'div' | Tag HTML à utiliser |

#### Exemples

##### Pleine largeur

```jsx
<GridItem span={4}>
  Contenu 100% largeur mobile
</GridItem>
```

##### Moitié de largeur

```jsx
<GridItem span={2}>
  Contenu 50% largeur mobile
</GridItem>
```

##### Responsive adaptatif

```jsx
<GridItem
  span={4}    // Mobile: 100%
  spanMd={4}  // Tablet: 50%
  spanLg={6}  // Desktop: 50%
>
  Contenu responsive
</GridItem>
```

##### Avec positionnement

```jsx
<GridItem
  span={2}
  start={2}    // Commence à la colonne 2 (centré)
>
  Contenu centré
</GridItem>
```

---

## 🎨 Exemples d'usage

### 1. Dashboard avec KPI

```jsx
<GridContainer>
  <GridItem span={2} spanMd={2} spanLg={3}>
    <div className="bg-bg-surface rounded-lg p-6">
      <p className="text-text-muted text-sm">Total Catégories</p>
      <p className="text-kpi text-primary">42</p>
    </div>
  </GridItem>

  <GridItem span={2} spanMd={2} spanLg={3}>
    <div className="bg-bg-surface rounded-lg p-6">
      <p className="text-text-muted text-sm">Matériels</p>
      <p className="text-kpi text-primary">1,234</p>
    </div>
  </GridItem>

  {/* Autres KPI... */}
</GridContainer>
```

### 2. Layout sidebar + contenu

```jsx
<GridContainer>
  {/* Sidebar */}
  <GridItem
    span={4}    // Mobile: 100%
    spanMd={2}  // Tablet: 25%
    spanLg={3}  // Desktop: 25%
  >
    <nav>Navigation</nav>
  </GridItem>

  {/* Contenu principal */}
  <GridItem
    span={4}    // Mobile: 100%
    spanMd={6}  // Tablet: 75%
    spanLg={9}  // Desktop: 75%
  >
    <main>Contenu</main>
  </GridItem>
</GridContainer>
```

### 3. Grille de cartes (3 colonnes desktop)

```jsx
<GridContainer>
  {items.map((item) => (
    <GridItem
      key={item.id}
      span={4}    // Mobile: 100%
      spanMd={4}  // Tablet: 50%
      spanLg={4}  // Desktop: 33.33%
    >
      <Card data={item} />
    </GridItem>
  ))}
</GridContainer>
```

---

## 🐛 Mode Debug

Le mode debug affiche la grille en overlay (Chartreuse transparent).

### Activation

```jsx
<GridContainer debug={true}>
  {/* Contenu */}
</GridContainer>
```

### Fonctionnement

1. Active uniquement en **développement** (`NODE_ENV === 'development'`)
2. Ajoute l'attribut `data-grid-debug="true"` sur `<html>`
3. Affiche un overlay Chartreuse semi-transparent
4. Se désactive automatiquement quand le composant est démonté

### Styles debug (personnalisables)

```css
:root {
  --grid-debug-bg: rgba(217, 255, 66, 0.05);      /* Fond colonnes */
  --grid-debug-line: rgba(217, 255, 66, 0.2);     /* Lignes gutter */
}

/* Thème clair */
[data-theme="light"] {
  --grid-debug-bg: rgba(0, 0, 0, 0.03);
  --grid-debug-line: rgba(0, 0, 0, 0.1);
}
```

---

## 🎨 Compatibilité thème clair

Le Grid System est prêt pour un futur thème clair.

### Activation

Ajoutez l'attribut `data-theme="light"` sur `<html>` :

```html
<html data-theme="light">
  <!-- App -->
</html>
```

### Variables adaptées

Les variables CSS s'adaptent automatiquement :

```css
/* Dark mode (défaut) */
--grid-debug-bg: rgba(217, 255, 66, 0.05);
--grid-debug-line: rgba(217, 255, 66, 0.2);

/* Light mode */
[data-theme="light"] {
  --grid-debug-bg: rgba(0, 0, 0, 0.03);
  --grid-debug-line: rgba(0, 0, 0, 0.1);
}
```

---

## 🔧 Configuration

### Tokens dans `tailwind.config.js`

```js
extend: {
  spacing: {
    'grid-gutter': '20px',
    'grid-margin': '20px',
  },
  gridTemplateColumns: {
    'grid-mobile': 'repeat(4, 1fr)',
    'grid-tablet': 'repeat(8, 1fr)',
    'grid-desktop': 'repeat(12, 1fr)',
  },
}
```

### Variables CSS dans `index.css`

```css
:root {
  /* Colonnes */
  --grid-columns-mobile: 4;
  --grid-columns-tablet: 8;
  --grid-columns-desktop: 12;

  /* Espacements */
  --grid-gutter: 20px;
  --grid-margin: 20px;
}
```

---

## 📊 Visualisation

```
Mobile (4 colonnes)
┌──────────────────────────────────┐
│ [──] [──] [──] [──]              │
│                                  │
└──────────────────────────────────┘

Tablet (8 colonnes)
┌──────────────────────────────────┐
│ [─] [─] [─] [─] [─] [─] [─] [─] │
│                                  │
└──────────────────────────────────┘

Desktop (12 colonnes)
┌──────────────────────────────────┐
│ [─][─][─][─][─][─][─][─][─][─][─][─] │
│                                      │
└──────────────────────────────────────┘
```

---

## 🧪 Page de démonstration

Accédez à la page de démonstration : **`/grid-demo`**

Elle contient :
- ✅ Tous les cas d'usage (uniforme, span, responsive, etc.)
- ✅ Toggle debug mode
- ✅ Documentation inline
- ✅ Exemples visuels
- ✅ Use cases réels (KPI, sidebar, cartes)

---

## ✅ Avantages

| Avantage | Description |
|----------|-------------|
| **CSS Grid natif** | Pas de dépendance, performances optimales |
| **Mobile-first** | Conçu pour mobile d'abord |
| **Responsive** | 4/8/12 colonnes selon breakpoint |
| **Réutilisable** | Composants React propres |
| **Maintenable** | Tokens centralisés |
| **Scalable** | S'adapte à tous les layouts |
| **Debug mode** | Overlay pour dev |
| **Thème compatible** | Prêt pour dark/light |

---

## 🚨 Bonnes pratiques

### ✅ À faire

```jsx
// ✅ Utiliser GridContainer + GridItem
<GridContainer>
  <GridItem span={2}>Contenu</GridItem>
</GridContainer>

// ✅ Responsive adaptatif
<GridItem span={4} spanMd={4} spanLg={6}>
  Contenu
</GridItem>

// ✅ Debug en dev uniquement
<GridContainer debug={isDevelopment}>
  {/* Contenu */}
</GridContainer>
```

### ❌ À éviter

```jsx
// ❌ Span > max colonnes
<GridItem span={5}> {/* Max 4 sur mobile */}

// ❌ Hardcode dans className
<div className="col-span-2"> {/* Utiliser GridItem */}

// ❌ Debug en prod
<GridContainer debug={true}> {/* Désactiver en prod */}
```

---

## 🔗 Liens utiles

- **Page de démo** : `/grid-demo`
- **CSS Grid MDN** : https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout
- **Tailwind Grid** : https://tailwindcss.com/docs/grid-template-columns

---

## 🎓 Support

Pour toute question ou amélioration, consulter :
1. La page de démonstration `/grid-demo`
2. Les commentaires dans `GridContainer.jsx` et `GridItem.jsx`
3. Ce fichier `GRID_SYSTEM.md`

---

**🎉 Grid System prêt à l'emploi ! Consultez `/grid-demo` pour voir tous les exemples.**
