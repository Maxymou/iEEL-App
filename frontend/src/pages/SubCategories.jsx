import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCategory, getCategorySousCategories } from '../services/api';
import SubCategoryList from '../components/SubCategoryList';
import Layout from '../components/Layout';

const SubCategories = () => {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [sousCategories, setSousCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔒 Flag pour éviter setState après unmount (memory leak)
    let mounted = true;

    const fetchData = async () => {
      try {
        if (mounted) setLoading(true);
        const [categoryRes, sousCategoriesRes] = await Promise.all([
          getCategory(id),
          getCategorySousCategories(id),
        ]);
        if (mounted) {
          setCategory(categoryRes.data);
          setSousCategories(sousCategoriesRes.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        if (mounted) {
          setError('Impossible de charger les données');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();

    // Cleanup: marquer le composant comme unmounted
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !category) {
    return (
      <Layout>
        <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-danger text-lg mb-4">{error || 'Catégorie non trouvée'}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-bg-primary rounded-lg font-medium hover:bg-primary-hover transition-all duration-150"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à l'accueil
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors duration-150"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Retour aux catégories
        </Link>

        {/* Zone KPI */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-6">
          <h1 className="text-2xl font-semibold text-text-main mb-1">{category.nom}</h1>
          <p className="text-text-muted text-sm mb-6">
            Sous-catégories de cette catégorie
          </p>
          <div className="flex items-baseline gap-3">
            <div className="text-kpi text-primary">{sousCategories.length}</div>
            <div className="text-text-muted">
              sous-catégorie{sousCategories.length > 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Liste des sous-catégories */}
        <SubCategoryList sousCategories={sousCategories} />
      </div>
    </Layout>
  );
};

export default SubCategories;
