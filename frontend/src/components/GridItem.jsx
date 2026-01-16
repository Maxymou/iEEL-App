/**
 * =============================================================================
 * GridItem - Composant d'élément de grille avec gestion du span responsive
 * =============================================================================
 *
 * Élément enfant de GridContainer pour placer du contenu sur N colonnes.
 *
 * SPÉCIFICATIONS :
 * - Span mobile : 1 à 4 colonnes
 * - Span tablet : 1 à 8 colonnes
 * - Span desktop : 1 à 12 colonnes
 * - Support du span responsive (mobile, tablet, desktop)
 * - Support du start position (optionnel)
 *
 * USAGE SIMPLE :
 * ```jsx
 * <GridItem span={2}>
 *   Contenu sur 2 colonnes (toutes tailles)
 * </GridItem>
 * ```
 *
 * USAGE RESPONSIVE :
 * ```jsx
 * <GridItem
 *   span={4}           // Mobile: 4 colonnes (pleine largeur)
 *   spanMd={4}         // Tablet: 4 colonnes (moitié)
 *   spanLg={6}         // Desktop: 6 colonnes (moitié)
 * >
 *   Contenu responsive
 * </GridItem>
 * ```
 *
 * USAGE AVANCÉ (avec positionnement) :
 * ```jsx
 * <GridItem
 *   span={2}
 *   start={2}          // Commence à la colonne 2
 *   spanMd={4}
 *   startMd={3}        // Tablet: commence à la colonne 3
 * >
 *   Contenu positionné
 * </GridItem>
 * ```
 *
 * PROPS :
 * @param {React.ReactNode} children - Contenu de l'élément
 * @param {number} span - Nombre de colonnes (mobile, 1-4)
 * @param {number} spanMd - Nombre de colonnes (tablet, 1-8)
 * @param {number} spanLg - Nombre de colonnes (desktop, 1-12)
 * @param {number} start - Position de départ (mobile, optionnel)
 * @param {number} startMd - Position de départ (tablet, optionnel)
 * @param {number} startLg - Position de départ (desktop, optionnel)
 * @param {string} className - Classes CSS additionnelles
 * @param {string} as - Tag HTML à utiliser (default: 'div')
 */

const GridItem = ({
  children,
  span = 1,
  spanMd,
  spanLg,
  start,
  startMd,
  startLg,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  /**
   * Génère les classes de span et start pour chaque breakpoint
   */
  const getGridClasses = () => {
    const classes = [];

    // Mobile: span (1-4 colonnes)
    if (span) {
      classes.push(`col-span-${span}`);
    }

    // Tablet: span (1-8 colonnes)
    if (spanMd !== undefined) {
      classes.push(`md:col-span-${spanMd}`);
    }

    // Desktop: span (1-12 colonnes)
    if (spanLg !== undefined) {
      classes.push(`lg:col-span-${spanLg}`);
    }

    // Position de départ (start)
    if (start) {
      classes.push(`col-start-${start}`);
    }

    if (startMd) {
      classes.push(`md:col-start-${startMd}`);
    }

    if (startLg) {
      classes.push(`lg:col-start-${startLg}`);
    }

    return classes.join(' ');
  };

  return (
    <Component
      className={`
        ${getGridClasses()}
        ${className}
      `.trim().replace(/\s+/g, ' ')}
      {...props}
    >
      {children}
    </Component>
  );
};

export default GridItem;
