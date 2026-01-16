/**
 * =============================================================================
 * GridDemo - Page de démonstration du Grid System
 * =============================================================================
 *
 * Cette page démontre toutes les fonctionnalités du Grid System :
 * - Grille responsive (4/8/12 colonnes)
 * - Span de colonnes
 * - Positionnement
 * - Mode debug
 * - Compatibilité dark/light theme
 *
 * NAVIGATION :
 * Pour accéder à cette page, ajoutez la route dans App.jsx :
 * <Route path="/grid-demo" element={<GridDemo />} />
 */

import { useState } from 'react';
import Layout from '../components/Layout';
import GridContainer from '../components/GridContainer';
import GridItem from '../components/GridItem';

const GridDemo = () => {
  const [debugMode, setDebugMode] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header avec contrôles */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-text-main mb-2">
            Grid System - Démonstration
          </h1>
          <p className="text-text-muted text-sm mb-4">
            Système de grille CSS Grid responsive : 4 colonnes (mobile) → 8 colonnes (tablet) → 12 colonnes (desktop)
          </p>

          {/* Toggle debug mode */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`h-11 px-5 rounded-lg font-medium transition-all duration-150 ${
                debugMode
                  ? 'bg-primary text-bg-primary'
                  : 'bg-bg-elevated text-text-main border border-border-default hover:border-primary/50'
              }`}
            >
              {debugMode ? '✓ Debug activé' : 'Activer debug'}
            </button>
            <span className="text-sm text-text-muted">
              Le mode debug affiche la grille en overlay (Chartreuse transparent)
            </span>
          </div>
        </div>

        {/* Exemple 1 : Grille uniforme */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            1. Grille uniforme (toutes colonnes égales)
          </h2>
          <GridContainer debug={debugMode}>
            {[1, 2, 3, 4].map((i) => (
              <GridItem key={i} span={1}>
                <div className="bg-bg-surface border border-border-default rounded-lg p-4 text-center">
                  <span className="text-text-muted text-sm">Col {i}</span>
                </div>
              </GridItem>
            ))}
          </GridContainer>
        </div>

        {/* Exemple 2 : Span de colonnes */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            2. Span de colonnes (2+2 / 3+1)
          </h2>
          <GridContainer debug={debugMode}>
            <GridItem span={2}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <h3 className="text-text-main font-medium mb-2">Span 2 colonnes</h3>
                <p className="text-text-muted text-sm">
                  Ce bloc occupe 2 colonnes sur mobile (50% de largeur)
                </p>
              </div>
            </GridItem>
            <GridItem span={2}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <h3 className="text-text-main font-medium mb-2">Span 2 colonnes</h3>
                <p className="text-text-muted text-sm">
                  Ce bloc occupe 2 colonnes sur mobile (50% de largeur)
                </p>
              </div>
            </GridItem>

            <GridItem span={3}>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                <h3 className="text-primary font-medium mb-2">Span 3 colonnes</h3>
                <p className="text-text-muted text-sm">
                  Ce bloc occupe 3 colonnes sur mobile (75% de largeur)
                </p>
              </div>
            </GridItem>
            <GridItem span={1}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <h3 className="text-text-main font-medium mb-2 text-sm">1 col</h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Exemple 3 : Full width */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            3. Pleine largeur (span 4)
          </h2>
          <GridContainer debug={debugMode}>
            <GridItem span={4}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <h3 className="text-text-main font-medium mb-2">Bloc pleine largeur</h3>
                <p className="text-text-muted text-sm">
                  Ce bloc occupe les 4 colonnes (100% de largeur mobile)
                </p>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Exemple 4 : Responsive (Mobile 4 → Tablet 4 → Desktop 6) */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            4. Layout responsive adaptatif
          </h2>
          <p className="text-text-muted text-sm mb-4">
            Mobile: 4 cols (100%) → Tablet: 4 cols (50%) → Desktop: 6 cols (50%)
          </p>
          <GridContainer debug={debugMode}>
            <GridItem span={4} spanMd={4} spanLg={6}>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 h-32 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-primary font-medium mb-1">Bloc A</h3>
                  <p className="text-text-muted text-xs">
                    Mobile: 100% | Tablet: 50% | Desktop: 50%
                  </p>
                </div>
              </div>
            </GridItem>
            <GridItem span={4} spanMd={4} spanLg={6}>
              <div className="bg-success/10 border border-success/30 rounded-lg p-6 h-32 flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-success font-medium mb-1">Bloc B</h3>
                  <p className="text-text-muted text-xs">
                    Mobile: 100% | Tablet: 50% | Desktop: 50%
                  </p>
                </div>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Exemple 5 : Responsive avancé (asymétrique) */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            5. Layout asymétrique responsive
          </h2>
          <p className="text-text-muted text-sm mb-4">
            Mobile: pleine largeur → Tablet: 2/3 + 1/3 → Desktop: sidebar + contenu
          </p>
          <GridContainer debug={debugMode}>
            {/* Sidebar */}
            <GridItem
              span={4}    // Mobile: 100%
              spanMd={2}  // Tablet: 25% (2/8)
              spanLg={3}  // Desktop: 25% (3/12)
            >
              <div className="bg-bg-surface border border-border-default rounded-lg p-6 h-64">
                <h3 className="text-text-main font-medium mb-2">Sidebar</h3>
                <p className="text-text-muted text-sm">
                  Navigation, filtres, etc.
                </p>
              </div>
            </GridItem>

            {/* Contenu principal */}
            <GridItem
              span={4}    // Mobile: 100%
              spanMd={6}  // Tablet: 75% (6/8)
              spanLg={9}  // Desktop: 75% (9/12)
            >
              <div className="bg-bg-surface border border-border-default rounded-lg p-6 h-64">
                <h3 className="text-text-main font-medium mb-2">Contenu principal</h3>
                <p className="text-text-muted text-sm">
                  Articles, listes, cartes, etc.
                </p>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Exemple 6 : Positionnement avec start */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            6. Positionnement personnalisé (start)
          </h2>
          <GridContainer debug={debugMode}>
            <GridItem span={2} start={2}>
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
                <h3 className="text-warning font-medium mb-2">Centré</h3>
                <p className="text-text-muted text-sm">
                  start=2, span=2 (colonnes 2-3)
                </p>
              </div>
            </GridItem>

            <GridItem span={2} start={3}>
              <div className="bg-danger/10 border border-danger/30 rounded-lg p-6">
                <h3 className="text-danger font-medium mb-2">À droite</h3>
                <p className="text-text-muted text-sm">
                  start=3, span=2 (colonnes 3-4)
                </p>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Exemple 7 : Use case réel - Dashboard KPI */}
        <div>
          <h2 className="text-lg font-semibold text-text-main mb-4">
            7. Use case : Dashboard avec KPI
          </h2>
          <GridContainer debug={debugMode}>
            {/* KPI 1 */}
            <GridItem span={2} spanMd={2} spanLg={3}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <p className="text-text-muted text-sm mb-2">Total Catégories</p>
                <p className="text-kpi text-primary">42</p>
              </div>
            </GridItem>

            {/* KPI 2 */}
            <GridItem span={2} spanMd={2} spanLg={3}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <p className="text-text-muted text-sm mb-2">Matériels</p>
                <p className="text-kpi text-primary">1,234</p>
              </div>
            </GridItem>

            {/* KPI 3 */}
            <GridItem span={2} spanMd={2} spanLg={3}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <p className="text-text-muted text-sm mb-2">Stock Total</p>
                <p className="text-kpi text-primary">89%</p>
              </div>
            </GridItem>

            {/* KPI 4 */}
            <GridItem span={2} spanMd={2} spanLg={3}>
              <div className="bg-bg-surface border border-border-default rounded-lg p-6">
                <p className="text-text-muted text-sm mb-2">Alertes</p>
                <p className="text-kpi text-warning">5</p>
              </div>
            </GridItem>
          </GridContainer>
        </div>

        {/* Documentation */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-6">
          <h2 className="text-lg font-semibold text-text-main mb-4">
            📚 Documentation
          </h2>
          <div className="space-y-3 text-sm text-text-muted">
            <div>
              <strong className="text-text-main">Breakpoints :</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mobile : &lt; 768px (4 colonnes)</li>
                <li>Tablet : ≥ 768px (8 colonnes)</li>
                <li>Desktop : ≥ 1024px (12 colonnes)</li>
              </ul>
            </div>

            <div>
              <strong className="text-text-main">Props GridItem :</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li><code>span</code> : 1-4 (mobile)</li>
                <li><code>spanMd</code> : 1-8 (tablet)</li>
                <li><code>spanLg</code> : 1-12 (desktop)</li>
                <li><code>start, startMd, startLg</code> : position de départ</li>
              </ul>
            </div>

            <div>
              <strong className="text-text-main">Debug mode :</strong>
              <p className="mt-1">
                Activez le debug pour voir la grille en overlay (Chartreuse transparent).
                Fonctionne uniquement en mode développement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GridDemo;
