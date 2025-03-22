const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Utilisateur = require("../models/utilisateur");


// Schémas de validation Joi
const utilisateurSchema = Joi.object({
  nom: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.empty': 'Le nom est requis',
      'string.min': 'Le nom doit contenir au moins {#limit} caractères',
      'string.max': 'Le nom ne peut pas dépasser {#limit} caractères'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Format d\'email invalide',
      'string.empty': 'L\'email est requis'
    }),
  
  motDePasse: Joi.string()
    .min(6)
    .pattern(new RegExp('^[a-zA-Z0-9]{6,30}$'))
    .required()
    .messages({
      'string.pattern.base': 'Le mot de passe doit contenir entre 6 et 30 caractères alphanumériques',
      'string.empty': 'Le mot de passe est requis',
      'string.min': 'Le mot de passe doit contenir au moins {#limit} caractères'
    })
});

// Middleware de validation
const validateUtilisateur = async (req, res, next) => {
  try {
    await utilisateurSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    const errors = error.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
};

// Middleware pour vérifier si l'ID est valide
const validateId = async (req, res, next) => {
  const idSchema = Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required();
  try {
    await idSchema.validateAsync(req.params.id);
    next();
  } catch (error) {
    return res.status(400).json({ message: 'ID utilisateur invalide' });
  }
};

/**
 * Post /api/utilisateurs
 * Création d'un utilisateur
 */
router.post('/', validateUtilisateur, async (req, res) => {
  try {
    const utilisateur = new Utilisateur(req.body);
    await utilisateur.save();
    
    // On ne renvoie pas le mot de passe dans la réponse
    const utilisateurSansMotDePasse = utilisateur.toObject();
    delete utilisateurSansMotDePasse.motDePasse;
    
    res.status(201).json(utilisateurSansMotDePasse);
  } catch (error) {
    if (error.code === 11000) { // Erreur de duplicate key (email unique)
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

/**
 * Get /api/utilisateurs
 * Récupération de la liste des utilisateurs
 */
router.get('/', async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find().select('-motDePasse');
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

/**
 * Get /api/utilisateurs/:id
 * Récupération d'un utilisateur par son id
 */
router.get('/:id', validateId, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findById(req.params.id).select('-motDePasse');
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur' });
  }
});

/**
 * Put /api/utilisateurs/:id
 * Mise à jour d'un utilisateur
 */
router.put('/:id', [validateId, validateUtilisateur], async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-motDePasse');

    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json(utilisateur);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

/**
 * DELETE /api/utilisateurs/:id
 * Suppression d'un utilisateur
 */
router.delete('/:id', validateId, async (req, res) => {
  try {
    const utilisateur = await Utilisateur.findByIdAndDelete(req.params.id);
    if (!utilisateur) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

module.exports = router;