import { useState, useEffect } from 'react';
import { getCategories, exportCSV } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import Layout from '../components/Layout';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 🔒 Flag pour éviter setState après unmount (memory leak)
    let mounted = true;

    const fetchCategories = async () => {
      try {
        if (mounted) setLoading(true);
        const response = await getCategories();
        if (mounted) {
          setCategories(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        if (mounted) {
          setError('Impossible de charger les catégories');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCategories();

    // Cleanup: marquer le composant comme unmounted
    return () => {
      mounted = false;
    };
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des catégories:', err);
      setError('Impossible de charger les catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ieel-export.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Erreur lors de l\'export:', err);
      alert('Erreur lors de l\'export CSV');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Chargement des catégories...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-danger text-lg mb-4">{error}</p>
          <button
            onClick={fetchCategories}
            className="h-11 px-6 bg-primary text-bg-primary rounded-lg font-medium hover:bg-primary-hover transition-all duration-150"
          >
            Réessayer
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Zone KPI */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-text-main mb-1">Inventaire iEEL</h1>
              <p className="text-text-muted text-sm mb-6">
                Gestion de matériel électrique
              </p>
              <div className="flex items-baseline gap-3">
                <div className="text-kpi text-primary">{categories.length}</div>
                <div className="text-text-muted">
                  catégorie{categories.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <button
              onClick={handleExport}
              className="h-11 px-5 bg-bg-elevated text-text-main border border-border-default rounded-lg font-medium hover:border-primary/50 hover:text-primary transition-all duration-150 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3 3m0 0l-3-3m3 3V10" />
              </svg>
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Grille de catégories */}
        {categories.length === 0 ? (
          <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-text-subtle mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-text-muted text-base">Aucune catégorie disponible</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Home;
