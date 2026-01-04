import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSousCategory, getSousCategoryMateriels, createMateriel } from '../services/api';
import MaterielCard from '../components/MaterielCard';
import MaterielForm from '../components/MaterielForm';
import Layout from '../components/Layout';

const Materiels = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sousCategory, setSousCategory] = useState(null);
  const [materiels, setMateriels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [sousCategoryRes, materielsRes] = await Promise.all([
        getSousCategory(id),
        getSousCategoryMateriels(id),
      ]);
      setSousCategory(sousCategoryRes.data);
      setMateriels(materielsRes.data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger les données');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMateriel = async (data) => {
    try {
      await createMateriel({
        ...data,
        sous_category_id: parseInt(id),
      });
      setShowForm(false);
      fetchData(); // Recharger les données
    } catch (err) {
      console.error('Erreur lors de la création:', err);
      alert('Erreur lors de la création du matériel');
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

  if (error || !sousCategory) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Sous-catégorie non trouvée'}</p>
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
          <div className="flex items-center space-x-2 text-sm font-medium mb-4">
            <Link to="/" className="text-apple-blue hover:underline">
              Accueil
            </Link>
            <span className="text-apple-text-secondary">›</span>
            <Link
              to={`/category/${sousCategory.category_id}`}
              className="text-apple-blue hover:underline"
            >
              {sousCategory.category_nom}
            </Link>
            <span className="text-apple-text-secondary">›</span>
            <span className="text-apple-text-secondary">{sousCategory.nom}</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-apple-text">{sousCategory.nom}</h1>
              <p className="mt-2 text-apple-text-secondary">
                {materiels.length} matériel{materiels.length > 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="px-6 py-3 bg-apple-blue text-white rounded-lg hover:shadow-md hover:bg-opacity-90 transition-all font-medium"
            >
              {showForm ? 'Annuler' : '+ Ajouter un matériel'}
            </button>
          </div>
        </div>

        {/* Formulaire de création */}
        {showForm && (
          <div className="bg-apple-gray rounded-xl p-6 border border-apple-border">
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              Nouveau matériel
            </h2>
            <MaterielForm
              onSubmit={handleCreateMateriel}
              onCancel={() => setShowForm(false)}
            />
          </div>
        )}

        {/* Grille de matériels */}
        {materiels.length === 0 ? (
          <div className="text-center py-12 bg-apple-gray rounded-xl">
            <p className="text-apple-text-secondary">Aucun matériel dans cette sous-catégorie</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 px-6 py-2 bg-apple-blue text-white rounded-lg hover:bg-opacity-90 transition-all"
            >
              Ajouter le premier matériel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materiels.map((materiel) => (
              <MaterielCard key={materiel.id} materiel={materiel} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Materiels;
