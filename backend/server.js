const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Connexion à la base de données
connectDB();

// Import des routes
const utilisateurRoutes = require("./routes/utilisateurs");
const tacheRoutes = require("./routes/taches");
const categorieRoutes = require("./routes/categories");

// Utilisation des routes avec des préfixes
app.use("/api/utilisateurs", utilisateurRoutes);
app.use("/api/taches", tacheRoutes);
app.use("/api/categories", categorieRoutes);

// Route de base
app.get("/", (req, res) => res.send("API is running"));

// Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ message: "Page not found" });
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something broke!" });
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));