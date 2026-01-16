import { useState } from 'react';

const MaterielForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nom: initialData.nom || '',
    section: initialData.section || '',
    diametre: initialData.diametre || '',
    poids_au_metre: initialData.poids_au_metre || '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Effacer l'erreur quand l'utilisateur modifie le champ
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    // Préparer les données (convertir les strings vides en null)
    const submitData = {
      ...formData,
      section: formData.section.trim() || null,
      diametre: formData.diametre.trim() || null,
      poids_au_metre: formData.poids_au_metre ? parseFloat(formData.poids_au_metre) : null,
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-bg-surface border border-border-default rounded-lg p-6 space-y-5">
      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-text-main mb-2">
          Nom du matériel <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={`w-full h-11 px-4 bg-bg-elevated border rounded-lg text-text-main placeholder-text-subtle focus:outline-none focus:ring-2 transition-all duration-150 ${
            errors.nom
              ? 'border-danger focus:ring-danger/20 focus:border-danger'
              : 'border-border-default focus:ring-primary/20 focus:border-primary'
          }`}
          placeholder="Ex: Câble HTA 20kV"
        />
        {errors.nom && (
          <p className="mt-1.5 text-sm text-danger flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {errors.nom}
          </p>
        )}
      </div>

      {/* Section */}
      <div>
        <label htmlFor="section" className="block text-sm font-medium text-text-main mb-2">
          Section
        </label>
        <input
          type="text"
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="w-full h-11 px-4 bg-bg-elevated border border-border-default rounded-lg text-text-main placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          placeholder="Ex: 240 mm²"
        />
      </div>

      {/* Diamètre */}
      <div>
        <label htmlFor="diametre" className="block text-sm font-medium text-text-main mb-2">
          Diamètre
        </label>
        <input
          type="text"
          id="diametre"
          name="diametre"
          value={formData.diametre}
          onChange={handleChange}
          className="w-full h-11 px-4 bg-bg-elevated border border-border-default rounded-lg text-text-main placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          placeholder="Ex: 24 mm"
        />
      </div>

      {/* Poids au mètre */}
      <div>
        <label htmlFor="poids_au_metre" className="block text-sm font-medium text-text-main mb-2">
          Poids au mètre (kg)
        </label>
        <input
          type="number"
          id="poids_au_metre"
          name="poids_au_metre"
          value={formData.poids_au_metre}
          onChange={handleChange}
          step="0.01"
          min="0"
          className="w-full h-11 px-4 bg-bg-elevated border border-border-default rounded-lg text-text-main placeholder-text-subtle focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-150"
          placeholder="Ex: 1.85"
        />
      </div>

      {/* Boutons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 h-11 bg-primary text-bg-primary px-6 rounded-lg font-medium hover:bg-primary-hover focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all duration-150"
        >
          {initialData.id ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 h-11 bg-bg-elevated text-text-main border border-border-default px-6 rounded-lg font-medium hover:bg-bg-elevated/70 hover:border-border-subtle focus:ring-2 focus:ring-border-subtle/20 focus:outline-none transition-all duration-150"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default MaterielForm;
