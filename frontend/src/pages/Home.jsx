import { useState, useEffect } from 'react';
import { getCategories, exportCSV } from '../services/api';
import CategoryCard from '../components/CategoryCard';
import Layout from '../components/Layout';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
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
            <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-apple-text-secondary">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchCategories}
            className="mt-4 px-6 py-2 bg-apple-blue text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Réessayer
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header avec bouton d'export */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-apple-text">Inventaire iEEL</h1>
            <p className="mt-2 text-apple-text-secondary">
              Gestion de matériel électrique - {categories.length} catégorie{categories.length > 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={handleExport}
            className="px-6 py-3 bg-apple-blue text-white rounded-lg hover:shadow-md hover:bg-opacity-90 transition-all font-medium"
          >
            📥 Exporter CSV
          </button>
        </div>

        {/* Grille de catégories */}
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-apple-gray rounded-xl">
            <p className="text-apple-text-secondary">Aucune catégorie disponible</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
