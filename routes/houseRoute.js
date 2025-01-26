const express = require("express");
const Maison = require("../modèles/house");
const mongoose = require("mongoose");
const router = express.Router();

// Ajouter une maison
router.post("/ajout", async (req, res) => {
  try {
    const { title, description, price, imageUrl, location, bedrooms, livingRooms } = req.body;

    // Validation des champs obligatoires
    if (!title || !description || !price || !location?.city || !location?.district) {
      return res.status(400).json({
        message: "Les champs 'title', 'description', 'price', et 'location' (avec 'city' et 'district') sont obligatoires.",
      });
    }

    // Création de la nouvelle maison
    const nouvelleMaison = new Maison({
      title,
      description,
      price,
      imageUrl,
      location,
      bedrooms,
      livingRooms,
    });

    const maisonSave = await nouvelleMaison.save();
    res.status(201).json(maisonSave);
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

// Récupérer toutes les maisons
router.get("/", async (req, res) => {
  try {
    const maisons = await Maison.find();
    if (!maisons || maisons.length === 0) {
      return res.status(404).json({ message: "Aucune maison trouvée." });
    }
    res.status(200).json(maisons);
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

// Modifier une maison
router.put("/:id", async (req, res) => {
  try {
    const maisonId = req.params.id;

    // Vérification de l'ID
    if (!mongoose.Types.ObjectId.isValid(maisonId)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const { title, description, price, imageUrl, location, bedrooms, livingRooms } = req.body;

    // Mise à jour des champs
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (imageUrl) updateData.imageUrl = imageUrl;
    if (location) updateData.location = location;
    if (bedrooms) updateData.bedrooms = bedrooms;
    if (livingRooms) updateData.livingRooms = livingRooms;

    const maisonModifiee = await Maison.findByIdAndUpdate(maisonId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!maisonModifiee) {
      return res.status(404).json({ message: "Maison introuvable." });
    }

    res.status(200).json(maisonModifiee);
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

// Supprimer une maison
router.delete("/:id", async (req, res) => {
  try {
    const maisonId = req.params.id;

    // Vérification de l'ID
    if (!mongoose.Types.ObjectId.isValid(maisonId)) {
      return res.status(400).json({ message: "ID invalide." });
    }

    const maisonSupprimee = await Maison.findByIdAndDelete(maisonId);

    if (!maisonSupprimee) {
      return res.status(404).json({ message: "Maison introuvable." });
    }

    res.status(200).json({ message: "Maison supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

module.exports = router;