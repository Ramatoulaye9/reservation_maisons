const mongoose = require('mongoose');

// Schéma principal pour la maison
const HouseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Le titre est obligatoire."] },
    description: { type: String, required: [true, "La description est obligatoire."] },
    price: {
      type: Number,
      required: [true, "Le prix est obligatoire."],
      min: [0, "Le prix doit être supérieur ou égal à 0."],
    },
    imageUrl: { type: String },
    bedrooms: { type: Number, default: 0 },
    livingRooms: { type: Number, default: 0 },
    city: { type: String, required: [true, "La ville est obligatoire."] },
    district: { type: String, required: [true, "Le quartier est obligatoire."] },
  },
  {
    timestamps: true,
  }
);

const House = mongoose.model("House", HouseSchema);
module.exports = House;