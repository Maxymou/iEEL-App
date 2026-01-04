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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryRes, sousCategoriesRes] = await Promise.all([
        getCategory(id),
        getCategorySousCategories(id),
      ]);
      setCategory(categoryRes.data);
      setSousCategories(sousCategoriesRes.data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
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

  if (error || !category) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Catégorie non trouvée'}</p>
          <Link
            to="/"
            className="mt-4 inline-block px-6 py-2 bg-apple-blue text-white rounded-lg hover:bg-opacity-90 transition-all"
          >
            Retour à l'accueil
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Breadcrumb et titre */}
        <div>
          <Link to="/" className="text-apple-blue hover:underline text-sm font-medium">
            ← Retour aux catégories
          </Link>
          <h1 className="mt-4 text-4xl font-bold text-apple-text">{category.nom}</h1>
          <p className="mt-2 text-apple-text-secondary">
            {sousCategories.length} sous-catégorie{sousCategories.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des sous-catégories */}
        <SubCategoryList sousCategories={sousCategories} />
      </div>
    </Layout>
  );
};

export default SubCategories;
