import { Link } from 'react-router-dom';

const SubCategoryList = ({ sousCategories }) => {
  if (!sousCategories || sousCategories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-apple-text-secondary">Aucune sous-catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sousCategories.map((sousCategory) => (
        <Link
          key={sousCategory.id}
          to={`/sous-category/${sousCategory.id}`}
          className="group bg-white border border-apple-border rounded-xl p-6 hover:shadow-md transition-all duration-200 hover:border-apple-blue"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-apple-text group-hover:text-apple-blue transition-colors">
                {sousCategory.nom}
              </h3>
              {sousCategory.category_nom && (
                <p className="text-sm text-apple-text-secondary mt-1">
                  {sousCategory.category_nom}
                </p>
              )}
            </div>
            <div className="text-apple-text-secondary group-hover:text-apple-blue group-hover:translate-x-1 transition-all">
              →
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubCategoryList;
