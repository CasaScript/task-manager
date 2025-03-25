const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const utilisateurSchema = new mongoose.Schema({
   nom: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   motDePasse: { type: String, required: true },
   dateCreation: { type: Date, default: Date.now },
   dernierConnexion: { type: Date },
});

// Middleware pour hacher le mot de passe avant la sauvegarde
utilisateurSchema.pre("save", async function (next) {
   if (!this.isModified("motDePasse")) return next();
   this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
});

// Mettre à jour la date de dernière connexion avant la sauvegarde 
utilisateurSchema.pre("save", function (next) {
  if (this.isModified("dernierConnexion")){
    this.dernierConnexion = Date.now();
  }
  next();
});

// Masquer le mot de passe dans les réponses JSON
utilisateurSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.motDePasse;
  return userObject;
};


module.exports = mongoose.model("Utilisateur", utilisateurSchema); 