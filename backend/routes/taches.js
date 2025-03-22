
const express = require('express');
const router = express.Router();

// Import du modèle Tache (vérifiez le chemin si besoin)
const Tache = require('../models/Tâche');

/**
 * POST /api/taches
 * Création d'une nouvelle tâche
 */
router.post('/', async (req, res) => {
  try {
    const tache = new Tache(req.body);
    await tache.save();
    res.status(201).json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/taches
 * Récupération de toutes les tâches
 */
router.get('/', async (req, res) => {
  try {
    const taches = await Tache.find()
      .populate('utilisateur')
      .populate('categories');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/taches/:id
 * Récupération d'une tâche par ID
 */
router.get('/:id', async (req, res) => {
  try {
    const tache = await Tache.findById(req.params.id)
      .populate('utilisateur')
      .populate('categories');
    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * PUT /api/taches/:id
 * Mise à jour d'une tâche (option { new: true } pour retourner la version mise à jour)
 */
router.put('/:id', async (req, res) => {
  try {
    const tache = await Tache.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('utilisateur')
      .populate('categories');
    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json(tache);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/taches/:id
 * Suppression d'une tâche
 */
router.delete('/:id', async (req, res) => {
  try {
    const tache = await Tache.findByIdAndDelete(req.params.id);
    if (!tache) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }
    res.json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * GET /api/taches/utilisateur/:id
 * Récupération des tâches d'un utilisateur (avec populate pour récupérer les informations associées)
 */
router.get('/utilisateur/:id', async (req, res) => {
  try {
    const taches = await Tache.find({ utilisateur: req.params.id })
      .populate('utilisateur')
      .populate('categories');
    res.json(taches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;