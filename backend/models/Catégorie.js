const mongoose = require ('mongoose');

const categorieSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    description: { type: String },
    dateCreation: { type: Date, default: Date.now },
    dateModification: { type: Date },
    icône: { type: String },
    taches: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tache' }]
});

module.exports = mongoose.model('Categorie', categorieSchema);