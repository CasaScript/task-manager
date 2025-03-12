const mongoose = require("mongoose");

const tacheSchema = new mongoose.Schema({
   titre: { type: String, required: true },
   description: { type: String },
   dateEcheance: { type: Date },
   priorite: { type: String, enum: ["Basse", "Moyenne", "Haute"], default: "Moyenne" },
   statut: { type: String, enum: ["À faire", "En cours", "Terminé"], default: "À faire" },
   utilisateurId: { type: mongoose.Schema.Types.ObjectId, ref: "Utilisateur", required: true },
   categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Categorie" }],
   dateCreation: { type: Date, default: Date.now },
   dateModification: { type: Date, }

module.exports = mongoose.model("Tache", tacheSchema);