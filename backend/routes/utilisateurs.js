const express = require('express');
const router = express.Router();
// Importation du modèle Utilisateur
const Utilisateur = require('../models/utilisateur');

/**
 * Post /api/utilisateurs
 * Création d'un utilisateur
 */
router.post ('/', (req, res) => {
  try {
    const utilisateur = new Utilisateur(req.body);
    await utilisateur.save();
    res.status(201).send(utilisateur);
  } catch (error) {
    res.status (500).json({error: error.message});
  }
});

/**
 * Get /api/utilisateurs
 * Récupération de la liste des utilisateurs
 */
router.get('/', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get /api/utilisateurs/:id
 * Récupération d'un utilisateur par son id
 */
router.get('/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * Put /api/utilisateurs/:id
 * Mise à jour d'un utilisateur
 */
router.put('/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * DELETE /api/utilisateurs/:id
 * Suppression d'un utilisateur
 */
router.delete('/:id', async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
