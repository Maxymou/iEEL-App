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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nom */}
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-apple-text mb-2">
          Nom du matériel *
        </label>
        <input
          type="text"
          id="nom"
          name="nom"
          value={formData.nom}
          onChange={handleChange}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all ${
            errors.nom
              ? 'border-red-500 focus:ring-red-200'
              : 'border-apple-border focus:ring-apple-blue focus:border-apple-blue'
          }`}
          placeholder="Ex: Câble HTA 20kV"
        />
        {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
      </div>

      {/* Section */}
      <div>
        <label htmlFor="section" className="block text-sm font-medium text-apple-text mb-2">
          Section
        </label>
        <input
          type="text"
          id="section"
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-apple-border rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-all"
          placeholder="Ex: 240 mm²"
        />
      </div>

      {/* Diamètre */}
      <div>
        <label htmlFor="diametre" className="block text-sm font-medium text-apple-text mb-2">
          Diamètre
        </label>
        <input
          type="text"
          id="diametre"
          name="diametre"
          value={formData.diametre}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-apple-border rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-all"
          placeholder="Ex: 24 mm"
        />
      </div>

      {/* Poids au mètre */}
      <div>
        <label htmlFor="poids_au_metre" className="block text-sm font-medium text-apple-text mb-2">
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
          className="w-full px-4 py-3 border border-apple-border rounded-lg focus:outline-none focus:ring-2 focus:ring-apple-blue focus:border-apple-blue transition-all"
          placeholder="Ex: 1.85"
        />
      </div>

      {/* Boutons */}
      <div className="flex items-center space-x-4 pt-4">
        <button
          type="submit"
          className="flex-1 bg-apple-blue text-white px-6 py-3 rounded-lg font-medium hover:bg-opacity-90 transition-all hover:shadow-md"
        >
          {initialData.id ? 'Mettre à jour' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-apple-gray text-apple-text px-6 py-3 rounded-lg font-medium hover:bg-opacity-80 transition-all"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default MaterielForm;
