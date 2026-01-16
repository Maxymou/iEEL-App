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
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-muted">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !sousCategory) {
    return (
      <Layout>
        <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-danger text-lg mb-4">{error || 'Sous-catégorie non trouvée'}</p>
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
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors duration-150">
            Accueil
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            to={`/category/${sousCategory.category_id}`}
            className="hover:text-primary transition-colors duration-150"
          >
            {sousCategory.category_nom}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-main">{sousCategory.nom}</span>
        </div>

        {/* Zone KPI */}
        <div className="bg-bg-surface border border-border-default rounded-lg p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-text-main mb-1">{sousCategory.nom}</h1>
              <p className="text-text-muted text-sm mb-6">
                Matériels de cette sous-catégorie
              </p>
              <div className="flex items-baseline gap-3">
                <div className="text-kpi text-primary">{materiels.length}</div>
                <div className="text-text-muted">
                  matériel{materiels.length > 1 ? 's' : ''}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className={`h-11 px-5 rounded-lg font-medium transition-all duration-150 flex items-center gap-2 ${
                showForm
                  ? 'bg-bg-elevated text-text-main border border-border-default hover:border-border-subtle'
                  : 'bg-primary text-bg-primary hover:bg-primary-hover'
              }`}
            >
              {showForm ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Annuler
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Ajouter un matériel
                </>
              )}
            </button>
          </div>
        </div>

        {/* Formulaire de création */}
        {showForm && (
          <div>
            <h2 className="text-lg font-semibold text-text-main mb-4">
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
          <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
            <svg className="w-16 h-16 text-text-subtle mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="text-text-muted text-base mb-4">Aucun matériel dans cette sous-catégorie</p>
            <button
              onClick={() => setShowForm(true)}
              className="h-11 px-6 bg-primary text-bg-primary rounded-lg font-medium hover:bg-primary-hover transition-all duration-150 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Ajouter le premier matériel
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
