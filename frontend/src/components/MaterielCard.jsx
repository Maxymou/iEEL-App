import { Link } from 'react-router-dom';

const MaterielCard = ({ materiel }) => {
  return (
    <Link
      to={`/materiel/${materiel.id}`}
      className="group block bg-white border border-apple-border rounded-xl p-5 hover:shadow-md transition-all duration-200 hover:border-apple-blue"
    >
      <div className="flex flex-col space-y-3">
        {/* Nom du matériel */}
        <h3 className="text-lg font-semibold text-apple-text group-hover:text-apple-blue transition-colors">
          {materiel.nom}
        </h3>

        {/* Détails techniques */}
        <div className="space-y-1 text-sm">
          {materiel.section && materiel.section !== 'N/A' && (
            <div className="flex justify-between">
              <span className="text-apple-text-secondary">Section:</span>
              <span className="text-apple-text font-medium">{materiel.section}</span>
            </div>
          )}
          {materiel.diametre && materiel.diametre !== 'N/A' && (
            <div className="flex justify-between">
              <span className="text-apple-text-secondary">Diamètre:</span>
              <span className="text-apple-text font-medium">{materiel.diametre}</span>
            </div>
          )}
          {materiel.poids_au_metre && (
            <div className="flex justify-between">
              <span className="text-apple-text-secondary">Poids/m:</span>
              <span className="text-apple-text font-medium">{materiel.poids_au_metre} kg</span>
            </div>
          )}
        </div>

        {/* Catégorie et sous-catégorie */}
        <div className="pt-2 border-t border-apple-border">
          <p className="text-xs text-apple-text-secondary">
            {materiel.category_nom && `${materiel.category_nom} / `}
            {materiel.sous_category_nom}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MaterielCard;
