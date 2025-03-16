const express = require("express");
const router = express.Router();
const Utilisateur = require("../models/Utilisateur");

// Créer un utilisateur
router.post("/", async (req, res) => {
  try {
    const utilisateur = new Utilisateur(req.body);
    await utilisateur.save();
    res.status(201).send(utilisateur);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Obtenir tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const utilisateurs = await Utilisateur.find();
    res.send(utilisateurs);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
