const express = require("express");
const House = require("../modèles/house");
const mongoose = require("mongoose");
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Route pour ajouter une maison avec image
router.post("/ajout", async (req, res) => {
  try {
    upload(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      }

      // Extraction des données du formulaire
      const { title, description, price, city, district, bedrooms, livingRooms } = req.body;
      const imageUrl = req.file ? req.file.path : '';

      if (!title || !description || !price || !city || !district || !imageUrl) {
        return res.status(400).json({ message: "Tous les champs sont requis." });
      }

      const newHouse = new House({
        title,
        description,
        price,
        bedrooms,
        livingRooms,
        city,
        district,
        imageUrl, // URL du fichier sur Cloudinary
      });

      const savedHouse = await newHouse.save();
      res.status(201).json({ message: "Maison ajoutée avec succès.", house: savedHouse });
    });
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

// Récupérer toutes les maisons
router.get("/", async (req, res) => {
  try {
    const maisons = await House.find();
    if (!maisons.length) {
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }
    const updateData = { ...req.body };
    const maisonModifiee = await House.findByIdAndUpdate(id, updateData, {
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
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide." });
    }
    const maisonSupprimee = await House.findByIdAndDelete(id);
    if (!maisonSupprimee) {
      return res.status(404).json({ message: "Maison introuvable." });
    }
    res.status(200).json({ message: "Maison supprimée avec succès." });
  } catch (error) {
    res.status(500).json({ message: `Erreur serveur : ${error.message}` });
  }
});

module.exports = router;