import { Link } from 'react-router-dom';

const SubCategoryList = ({ sousCategories }) => {
  if (!sousCategories || sousCategories.length === 0) {
    return (
      <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
        <svg className="w-16 h-16 text-text-subtle mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-text-muted text-base">Aucune sous-catégorie disponible</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sousCategories.map((sousCategory) => (
        <Link
          key={sousCategory.id}
          to={`/sous-category/${sousCategory.id}`}
          className="group bg-bg-surface border border-border-default rounded-lg p-5 hover:border-primary/50 transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-text-main group-hover:text-primary transition-colors duration-150 truncate">
                {sousCategory.nom}
              </h3>
              {sousCategory.category_nom && (
                <p className="text-sm text-text-muted mt-1 truncate">
                  {sousCategory.category_nom}
                </p>
              )}
            </div>
            <svg
              className="w-5 h-5 text-text-subtle group-hover:text-primary group-hover:translate-x-1 transition-all duration-150 flex-shrink-0 ml-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SubCategoryList;
