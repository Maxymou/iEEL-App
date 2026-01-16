import { Link } from 'react-router-dom';

const MaterielCard = ({ materiel }) => {
  return (
    <Link
      to={`/materiel/${materiel.id}`}
      className="group block bg-bg-surface border border-border-default rounded-lg p-5 hover:border-primary/50 transition-all duration-150"
    >
      <div className="flex flex-col space-y-3">
        {/* Nom du matériel */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors duration-150 flex-1">
            {materiel.nom}
          </h3>
          <svg
            className="w-5 h-5 text-text-subtle group-hover:text-primary transition-all duration-150 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Détails techniques */}
        {(materiel.section || materiel.diametre || materiel.poids_au_metre) && (
          <div className="grid grid-cols-2 gap-2 text-sm">
            {materiel.section && materiel.section !== 'N/A' && (
              <div className="bg-bg-elevated rounded px-3 py-2">
                <span className="text-text-subtle text-xs block mb-0.5">Section</span>
                <span className="text-text-main font-medium">{materiel.section}</span>
              </div>
            )}
            {materiel.diametre && materiel.diametre !== 'N/A' && (
              <div className="bg-bg-elevated rounded px-3 py-2">
                <span className="text-text-subtle text-xs block mb-0.5">Diamètre</span>
                <span className="text-text-main font-medium">{materiel.diametre}</span>
              </div>
            )}
            {materiel.poids_au_metre && (
              <div className="bg-bg-elevated rounded px-3 py-2 col-span-2">
                <span className="text-text-subtle text-xs block mb-0.5">Poids/m</span>
                <span className="text-text-main font-medium">{materiel.poids_au_metre} kg</span>
              </div>
            )}
          </div>
        )}

        {/* Catégorie et sous-catégorie */}
        <div className="pt-2 border-t border-border-default">
          <p className="text-xs text-text-muted truncate">
            {materiel.category_nom && `${materiel.category_nom} / `}
            {materiel.sous_category_nom}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MaterielCard;
