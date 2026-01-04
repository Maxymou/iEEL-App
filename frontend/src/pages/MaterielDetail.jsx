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
    fetchMateriel();
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
            <div className="w-16 h-16 border-4 border-apple-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-apple-text-secondary">Chargement...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !materiel) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Matériel non trouvé'}</p>
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
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm font-medium">
          <Link to="/" className="text-apple-blue hover:underline">
            Accueil
          </Link>
          <span className="text-apple-text-secondary">›</span>
          <Link
            to={`/category/${materiel.category_id}`}
            className="text-apple-blue hover:underline"
          >
            {materiel.category_nom}
          </Link>
          <span className="text-apple-text-secondary">›</span>
          <Link
            to={`/sous-category/${materiel.sous_category_id}`}
            className="text-apple-blue hover:underline"
          >
            {materiel.sous_category_nom}
          </Link>
          <span className="text-apple-text-secondary">›</span>
          <span className="text-apple-text-secondary">{materiel.nom}</span>
        </div>

        {/* Contenu principal */}
        {isEditing ? (
          <div className="bg-white border border-apple-border rounded-xl p-8">
            <h2 className="text-2xl font-semibold text-apple-text mb-6">
              Modifier le matériel
            </h2>
            <MaterielForm
              initialData={materiel}
              onSubmit={handleUpdate}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        ) : (
          <div className="bg-white border border-apple-border rounded-xl p-8">
            {/* Titre et actions */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
              <h1 className="text-4xl font-bold text-apple-text">{materiel.nom}</h1>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-apple-blue text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-opacity-90 transition-all font-medium"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>

            {/* Détails */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Section */}
                {materiel.section && (
                  <div className="bg-apple-gray rounded-lg p-4">
                    <p className="text-sm text-apple-text-secondary mb-1">Section</p>
                    <p className="text-lg font-semibold text-apple-text">{materiel.section}</p>
                  </div>
                )}

                {/* Diamètre */}
                {materiel.diametre && (
                  <div className="bg-apple-gray rounded-lg p-4">
                    <p className="text-sm text-apple-text-secondary mb-1">Diamètre</p>
                    <p className="text-lg font-semibold text-apple-text">{materiel.diametre}</p>
                  </div>
                )}

                {/* Poids au mètre */}
                {materiel.poids_au_metre && (
                  <div className="bg-apple-gray rounded-lg p-4">
                    <p className="text-sm text-apple-text-secondary mb-1">Poids au mètre</p>
                    <p className="text-lg font-semibold text-apple-text">
                      {materiel.poids_au_metre} kg/m
                    </p>
                  </div>
                )}
              </div>

              {/* Catégorisation */}
              <div className="border-t border-apple-border pt-6">
                <h3 className="text-lg font-semibold text-apple-text mb-4">Catégorisation</h3>
                <div className="space-y-2">
                  <p className="text-apple-text-secondary">
                    <span className="font-medium">Catégorie:</span>{' '}
                    <Link
                      to={`/category/${materiel.category_id}`}
                      className="text-apple-blue hover:underline"
                    >
                      {materiel.category_nom}
                    </Link>
                  </p>
                  <p className="text-apple-text-secondary">
                    <span className="font-medium">Sous-catégorie:</span>{' '}
                    <Link
                      to={`/sous-category/${materiel.sous_category_id}`}
                      className="text-apple-blue hover:underline"
                    >
                      {materiel.sous_category_nom}
                    </Link>
                  </p>
                </div>
              </div>

              {/* Date de création */}
              <div className="text-sm text-apple-text-secondary">
                Créé le {new Date(materiel.created_at).toLocaleDateString('fr-FR')}
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-md w-full">
              <h3 className="text-2xl font-bold text-apple-text mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-apple-text-secondary mb-6">
                Êtes-vous sûr de vouloir supprimer "{materiel.nom}" ? Cette action est irréversible.
              </p>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-medium"
                >
                  Supprimer
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-apple-gray text-apple-text px-6 py-3 rounded-lg hover:bg-opacity-80 transition-all font-medium"
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
