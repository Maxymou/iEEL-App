import pool from './connection.js';
import dotenv from 'dotenv';

dotenv.config();

// Données de test pour l'application iEEL
const seedData = async () => {
  try {
    console.log('🌱 Démarrage du seed de la base de données...\n');

    // Nettoyer les tables existantes
    console.log('🧹 Nettoyage des tables existantes...');
    await pool.query('TRUNCATE TABLE materiels, sous_categories, categories RESTART IDENTITY CASCADE');

    // 1. Créer les catégories
    console.log('📁 Création des catégories...');
    const categories = [
      { nom: 'Câbles' },
      { nom: 'Transformateurs' },
      { nom: 'Accessoires' }
    ];

    const categoryIds = {};
    for (const cat of categories) {
      const result = await pool.query(
        'INSERT INTO categories (nom) VALUES ($1) RETURNING id, nom',
        [cat.nom]
      );
      categoryIds[cat.nom] = result.rows[0].id;
      console.log(`  ✓ ${cat.nom} (ID: ${result.rows[0].id})`);
    }

    // 2. Créer les sous-catégories
    console.log('\n📂 Création des sous-catégories...');
    const sousCategories = [
      { nom: 'Haute tension', category: 'Câbles' },
      { nom: 'Basse tension', category: 'Câbles' },
      { nom: 'Distribution', category: 'Transformateurs' },
      { nom: 'Puissance', category: 'Transformateurs' },
      { nom: 'Connecteurs', category: 'Accessoires' },
      { nom: 'Protection', category: 'Accessoires' }
    ];

    const sousCategoryIds = {};
    for (const sousCat of sousCategories) {
      const result = await pool.query(
        'INSERT INTO sous_categories (nom, category_id) VALUES ($1, $2) RETURNING id, nom',
        [sousCat.nom, categoryIds[sousCat.category]]
      );
      sousCategoryIds[sousCat.nom] = result.rows[0].id;
      console.log(`  ✓ ${sousCat.nom} → ${sousCat.category} (ID: ${result.rows[0].id})`);
    }

    // 3. Créer les matériels
    console.log('\n🔧 Création des matériels...\n');
    const materiels = [
      // Câbles - Haute tension
      {
        nom: 'Câble HTA 20kV Aluminium',
        section: '240 mm²',
        diametre: '24 mm',
        poids_au_metre: 1.85,
        sous_category: 'Haute tension'
      },
      {
        nom: 'Câble HTA 20kV Cuivre',
        section: '150 mm²',
        diametre: '22 mm',
        poids_au_metre: 2.10,
        sous_category: 'Haute tension'
      },
      {
        nom: 'Câble HTB 63kV',
        section: '400 mm²',
        diametre: '32 mm',
        poids_au_metre: 3.45,
        sous_category: 'Haute tension'
      },
      {
        nom: 'Câble HTA 15kV',
        section: '95 mm²',
        diametre: '18 mm',
        poids_au_metre: 1.25,
        sous_category: 'Haute tension'
      },
      {
        nom: 'Câble HTA 36kV',
        section: '300 mm²',
        diametre: '28 mm',
        poids_au_metre: 2.85,
        sous_category: 'Haute tension'
      },

      // Câbles - Basse tension
      {
        nom: 'Câble BT 400V',
        section: '95 mm²',
        diametre: '15 mm',
        poids_au_metre: 0.92,
        sous_category: 'Basse tension'
      },
      {
        nom: 'Câble BT Tétrapolaire',
        section: '50 mm²',
        diametre: '12 mm',
        poids_au_metre: 0.68,
        sous_category: 'Basse tension'
      },
      {
        nom: 'Câble BT Souple',
        section: '35 mm²',
        diametre: '10 mm',
        poids_au_metre: 0.52,
        sous_category: 'Basse tension'
      },
      {
        nom: 'Câble BT Rigide',
        section: '70 mm²',
        diametre: '13 mm',
        poids_au_metre: 0.78,
        sous_category: 'Basse tension'
      },
      {
        nom: 'Câble BT Armé',
        section: '120 mm²',
        diametre: '18 mm',
        poids_au_metre: 1.35,
        sous_category: 'Basse tension'
      },

      // Transformateurs - Distribution
      {
        nom: 'Transformateur 20kV/400V 100kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Distribution'
      },
      {
        nom: 'Transformateur 20kV/400V 250kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Distribution'
      },
      {
        nom: 'Transformateur 20kV/400V 400kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Distribution'
      },
      {
        nom: 'Transformateur 15kV/400V 160kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Distribution'
      },
      {
        nom: 'Transformateur 20kV/400V 630kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Distribution'
      },

      // Transformateurs - Puissance
      {
        nom: 'Transformateur Triphasé 1000kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Puissance'
      },
      {
        nom: 'Transformateur Triphasé 1600kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Puissance'
      },
      {
        nom: 'Transformateur Triphasé 2500kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Puissance'
      },
      {
        nom: 'Transformateur Élévateur 63kV',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Puissance'
      },
      {
        nom: 'Transformateur Sec 800kVA',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Puissance'
      },

      // Accessoires - Connecteurs
      {
        nom: 'Connecteur à compression 240mm²',
        section: '240 mm²',
        diametre: '8 mm',
        poids_au_metre: 0.15,
        sous_category: 'Connecteurs'
      },
      {
        nom: 'Connecteur à vis 95mm²',
        section: '95 mm²',
        diametre: '6 mm',
        poids_au_metre: 0.08,
        sous_category: 'Connecteurs'
      },
      {
        nom: 'Connecteur à sertir 150mm²',
        section: '150 mm²',
        diametre: '7 mm',
        poids_au_metre: 0.12,
        sous_category: 'Connecteurs'
      },
      {
        nom: 'Connecteur rapide 50mm²',
        section: '50 mm²',
        diametre: '5 mm',
        poids_au_metre: 0.05,
        sous_category: 'Connecteurs'
      },
      {
        nom: 'Connecteur étanche 120mm²',
        section: '120 mm²',
        diametre: '7 mm',
        poids_au_metre: 0.10,
        sous_category: 'Connecteurs'
      },

      // Accessoires - Protection
      {
        nom: 'Disjoncteur différentiel 63A',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Protection'
      },
      {
        nom: 'Parafoudre Type 1',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Protection'
      },
      {
        nom: 'Fusible HTA 20kV 40A',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Protection'
      },
      {
        nom: 'Relais de protection numérique',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Protection'
      },
      {
        nom: 'Interrupteur sectionneur 125A',
        section: 'N/A',
        diametre: 'N/A',
        poids_au_metre: null,
        sous_category: 'Protection'
      }
    ];

    let count = 0;
    for (const mat of materiels) {
      await pool.query(
        `INSERT INTO materiels (nom, section, diametre, poids_au_metre, sous_category_id)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          mat.nom,
          mat.section,
          mat.diametre,
          mat.poids_au_metre,
          sousCategoryIds[mat.sous_category]
        ]
      );
      count++;
      console.log(`  ✓ [${count}/${materiels.length}] ${mat.nom}`);
    }

    // Afficher un résumé
    console.log('\n📊 Résumé du seed:');
    console.log(`  • ${categories.length} catégories créées`);
    console.log(`  • ${sousCategories.length} sous-catégories créées`);
    console.log(`  • ${materiels.length} matériels créés\n`);
    console.log('✅ Seed terminé avec succès!\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
};

// Exécuter le seed
seedData();
