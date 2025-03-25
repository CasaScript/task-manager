const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Categorie = require('../models/Catégorie');
const Tache = require('../models/Tâche'); 

// Schéma de validation Joi
const categorieSchema = Joi.object({
  nom: Joi.string().min(3).max(30).required(),
  description: Joi.string().max(255),
});

// Middleware de validation
const validateCategorie = async (req, res, next) => {
  try {
    await categorieSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
};

/**
 * POST /api/categories
 * Création d'une nouvelle catégorie
 */
router.post('/', validateCategorie, async (req, res) => {
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
router.put('/:id', validateCategorie, async (req, res) => {
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