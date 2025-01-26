const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Référence vers l'utilisateur
    ref: "User",
    required: true,
  },
  houseId: {
    type: mongoose.Schema.Types.ObjectId, // Référence vers la maison
    ref: "House",
    required: true,
  },
  reservationDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled"],
    default: "pending",
  },
});

const Reservation = mongoose.model("Reservation", reservationSchema);
module.exports = Reservation;