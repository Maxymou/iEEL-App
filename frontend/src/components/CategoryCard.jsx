import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Icônes simples avec emojis pour chaque catégorie
  const getIcon = (name) => {
    if (name.toLowerCase().includes('câble')) return '⚡';
    if (name.toLowerCase().includes('transformateur')) return '🔌';
    if (name.toLowerCase().includes('accessoire')) return '🔧';
    return '📦';
  };

  return (
    <Link
      to={`/category/${category.id}`}
      className="group block bg-white border border-apple-border rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:scale-102"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Icône */}
        <div className="w-20 h-20 bg-apple-gray rounded-2xl flex items-center justify-center text-4xl group-hover:bg-apple-blue group-hover:scale-110 transition-all duration-200">
          <span className="group-hover:scale-110 transition-transform duration-200">
            {getIcon(category.nom)}
          </span>
        </div>

        {/* Nom de la catégorie */}
        <div>
          <h3 className="text-xl font-semibold text-apple-text group-hover:text-apple-blue transition-colors">
            {category.nom}
          </h3>
        </div>

        {/* Indicateur visuel */}
        <div className="text-apple-text-secondary text-sm group-hover:text-apple-blue transition-colors">
          Voir les sous-catégories →
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
