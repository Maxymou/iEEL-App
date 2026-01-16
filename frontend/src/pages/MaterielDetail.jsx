import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMateriel, updateMateriel, deleteMateriel } from '../services/api';
import MaterielForm from '../components/MaterielForm';
import Layout from '../components/Layout';

const MaterielDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materiel, setMateriel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // 🔒 Flag pour éviter setState après unmount (memory leak)
    let mounted = true;

    const fetchMateriel = async () => {
      try {
        if (mounted) setLoading(true);
        const response = await getMateriel(id);
        if (mounted) {
          setMateriel(response.data);
        }
      } catch (err) {
        console.error('Erreur lors du chargement:', err);
        if (mounted) {
          setError('Impossible de charger le matériel');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMateriel();

    // Cleanup: marquer le composant comme unmounted
    return () => {
      mounted = false;
    };
  }, [id]);

  const fetchMateriel = async () => {
    try {
      setLoading(true);
      const response = await getMateriel(id);
      setMateriel(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger le matériel');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      await updateMateriel(id, data);
      setIsEditing(false);
      fetchMateriel(); // Recharger les données
    } catch (err) {
      console.error('Erreur lors de la mise à jour:', err);
      alert('Erreur lors de la mise à jour du matériel');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteMateriel(id);
      navigate(`/sous-category/${materiel.sous_category_id}`);
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      alert('Erreur lors de la suppression du matériel');
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

  if (error || !materiel) {
    return (
      <Layout>
        <div className="bg-bg-surface border border-border-default rounded-lg p-12 text-center">
          <svg className="w-16 h-16 text-danger mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-danger text-lg mb-4">{error || 'Matériel non trouvé'}</p>
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
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link to="/" className="hover:text-primary transition-colors duration-150">
            Accueil
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            to={`/category/${materiel.category_id}`}
            className="hover:text-primary transition-colors duration-150"
          >
            {materiel.category_nom}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <Link
            to={`/sous-category/${materiel.sous_category_id}`}
            className="hover:text-primary transition-colors duration-150"
          >
            {materiel.sous_category_nom}
          </Link>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          <span className="text-text-main">{materiel.nom}</span>
        </div>

        {/* Contenu principal */}
        {isEditing ? (
          <div>
            <h2 className="text-lg font-semibold text-text-main mb-4">
              Modifier le matériel
            </h2>
            <MaterielForm
              initialData={materiel}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="bg-bg-surface border border-border-default rounded-lg p-6">
            {/* Titre et actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-border-default">
              <h1 className="text-2xl font-semibold text-text-main">{materiel.nom}</h1>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="h-11 px-5 bg-bg-elevated text-text-main border border-border-default rounded-lg font-medium hover:border-primary/50 hover:text-primary transition-all duration-150 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="h-11 px-5 bg-danger text-white rounded-lg font-medium hover:bg-danger-hover transition-all duration-150 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Supprimer
                </button>
              </div>
            </div>

            {/* Détails techniques */}
            <div className="space-y-6">
              {(materiel.section || materiel.diametre || materiel.poids_au_metre) && (
                <div>
                  <h3 className="text-sm font-semibold text-text-main mb-3 uppercase tracking-wider">
                    Spécifications techniques
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materiel.section && (
                      <div className="bg-bg-elevated rounded-lg p-4 border border-border-default">
                        <p className="text-xs text-text-subtle mb-1">Section</p>
                        <p className="text-lg font-semibold text-text-main">{materiel.section}</p>
                      </div>
                    )}
                    {materiel.diametre && (
                      <div className="bg-bg-elevated rounded-lg p-4 border border-border-default">
                        <p className="text-xs text-text-subtle mb-1">Diamètre</p>
                        <p className="text-lg font-semibold text-text-main">{materiel.diametre}</p>
                      </div>
                    )}
                    {materiel.poids_au_metre && (
                      <div className="bg-bg-elevated rounded-lg p-4 border border-border-default">
                        <p className="text-xs text-text-subtle mb-1">Poids au mètre</p>
                        <p className="text-lg font-semibold text-text-main">
                          {materiel.poids_au_metre} kg/m
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Catégorisation */}
              <div className="pt-6 border-t border-border-default">
                <h3 className="text-sm font-semibold text-text-main mb-3 uppercase tracking-wider">
                  Catégorisation
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">Catégorie:</span>
                    <Link
                      to={`/category/${materiel.category_id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {materiel.category_nom}
                    </Link>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-text-muted">Sous-catégorie:</span>
                    <Link
                      to={`/sous-category/${materiel.sous_category_id}`}
                      className="text-primary hover:underline font-medium"
                    >
                      {materiel.sous_category_nom}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Date de création */}
              <div className="pt-4 border-t border-border-default">
                <p className="text-xs text-text-subtle">
                  Créé le {new Date(materiel.created_at).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-bg-surface border border-border-default rounded-lg p-8 max-w-md w-full">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-text-main mb-2">
                    Confirmer la suppression
                  </h3>
                  <p className="text-text-muted text-sm">
                    Êtes-vous sûr de vouloir supprimer <span className="font-medium text-text-main">"{materiel.nom}"</span> ? Cette action est irréversible.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDelete}
                  className="flex-1 h-11 bg-danger text-white px-6 rounded-lg font-medium hover:bg-danger-hover transition-all duration-150"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 h-11 bg-bg-elevated text-text-main border border-border-default px-6 rounded-lg font-medium hover:bg-bg-elevated/70 hover:border-border-subtle transition-all duration-150"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MaterielDetail;
