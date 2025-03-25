const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    
    // Création des index
    const utilisateurModel = mongoose.model("Utilisateur");
    await utilisateurModel.collection.createIndex({ email: 1 }, { unique: true });
    
    const tacheModel = mongoose.model("Tache");
    await tacheModel.collection.createIndex({ utilisateur: 1 });
    await tacheModel.collection.createIndex({ dateEcheance: 1 });
    await tacheModel.collection.createIndex({ utilisateur: 1, dateEcheance: -1 });
    
    const categorieModel = mongoose.model("Categorie");
    await categorieModel.collection.createIndex({ nom: 1 }, { unique: true });

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};






module.exports = connectDB;