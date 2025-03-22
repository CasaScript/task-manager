
const express = require('express');
const router = express.Router();

// Import du modèle Categorie et, si nécessaire, du modèle Tache pour les relations
const Categorie = require('../models/Catégorie');
const Tache = require('../models/Tâche'); // Optionnel selon votre approche

/**
 * POST /api/categories
 * Création d'une nouvelle catégorie
 */
router.post('/', async (req, res) => {
  try {
    const categorie = new Categorie(req.body);
    await categorie.save();
    res.status(201).json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/categories
 * Récupération de toutes les catégories
 */
router.get('/', async (req, res) => {
  try {
    const categories = await Categorie.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/categories/:id
 * Récupération d'une catégorie par ID
 */
router.get('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/categories/:id
 * Mise à jour d'une catégorie
 */
router.put('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json(categorie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/categories/:id
 * Suppression d'une catégorie
 */
router.delete('/:id', async (req, res) => {
  try {
    const categorie = await Categorie.findByIdAndDelete(req.params.id);
    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json({ message: "Catégorie supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/categories/:id/taches
 * Récupération des tâches d'une catégorie.
 * Ici, on utilise populate() sur le champ 'taches' de la catégorie.
 * (Option : vous pouvez également interroger directement le modèle Tache si besoin.)
 */
router.get('/:id/taches', async (req, res) => {
  try {
    const categorie = await Categorie.findById(req.params.id).populate('taches');
    if (!categorie) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }
    res.json(categorie.taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;