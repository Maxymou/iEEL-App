/**
 * =============================================================================
 * GridContainer - Composant de conteneur de grille responsive
 * =============================================================================
 *
 * Conteneur principal pour le système de grille CSS Grid.
 *
 * SPÉCIFICATIONS :
 * - Mobile (< 768px) : 4 colonnes
 * - Tablet (>= 768px) : 8 colonnes
 * - Desktop (>= 1024px) : 12 colonnes
 * - Gutter (espacement entre colonnes) : 20px
 * - Marges latérales (safe area) : 20px
 * - Type : Stretch (colonnes fluides avec 1fr)
 *
 * USAGE :
 * ```jsx
 * <GridContainer>
 *   <GridItem span={2}>Contenu sur 2 colonnes</GridItem>
 *   <GridItem span={2}>Contenu sur 2 colonnes</GridItem>
 * </GridContainer>
 * ```
 *
 * PROPS :
 * @param {React.ReactNode} children - Éléments enfants (GridItem recommandés)
 * @param {string} className - Classes CSS additionnelles
 * @param {boolean} debug - Active l'overlay de debug (dev only)
 * @param {string} as - Tag HTML à utiliser (default: 'div')
 */

import { useEffect } from 'react';

const GridContainer = ({
  children,
  className = '',
  debug = false,
  as: Component = 'div',
  ...props
}) => {
  // Active/désactive le mode debug sur <html>
  useEffect(() => {
    if (debug && process.env.NODE_ENV === 'development') {
      document.documentElement.setAttribute('data-grid-debug', 'true');
      return () => {
        document.documentElement.removeAttribute('data-grid-debug');
      };
    }
  }, [debug]);

  return (
    <Component
      className={`
        grid-container
        relative
        w-full
        mx-auto
        px-grid-margin

        /* Grid CSS - Mobile: 4 colonnes */
        grid
        grid-cols-grid-mobile
        gap-grid-gutter

        /* Tablet: 8 colonnes */
        md:grid-cols-grid-tablet

        /* Desktop: 12 colonnes */
        lg:grid-cols-grid-desktop

        /* Classes additionnelles */
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GridContainer;
