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
  function(next) {
   if (!this.isModified("motDePasse"))
      return next();
   this.motDpasse = await bcrypt.hash(this.motDePasse, 10);
  }
});

// Masquer le mot de passe dans les réponses JSON
utilisateurSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.motDePasse;
  return userObject;
};


module.exports = mongoose.model("Utilisateur", utilisateurSchema); 