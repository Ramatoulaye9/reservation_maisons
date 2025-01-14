const mongoose = require('mongoose');
const locationSchema = require('./location'); // Importez le schéma, pas le modèle
const Reservation = require('./reservation'); // Importez le modèle Reservation

const HouseSchema = new mongoose.Schema(
    {
        title: { type: String, required: [true, "S'il vous plaît, entrez le type d'hébergement."] },
        description: { type: String, required: true },
        price: {
            type: Number,
            required: [true, "Le champ 'prix' est obligatoire."],
            min: [0, "Le prix doit être supérieur ou égal à 0."]
        },
        imageUrl: { type: String, required: false },
        isReserved: { type: Boolean, default: false },
        bedrooms: { type: Number },
        livingRooms: { type: Number },
        location: {
            type: locationSchema, // Utilisation du sous-schéma
            required: true,
        },
        reservation: {
            type: mongoose.Schema.Types.ObjectId, // Référence vers le modèle Reservation
            ref: 'Reservation',
            required: false,
        },
    },
    {
        timestamps: true,
    }
);

const House = mongoose.model("House", HouseSchema);
module.exports = House;