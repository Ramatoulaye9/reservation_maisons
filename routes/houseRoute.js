const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const House = require("../modèles/house");

const router = express.Router();

// Configuration Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Format invalide. Utilisez jpg, jpeg ou png."));
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Ajouter une maison
router.post("/ajout", upload.single("image"), async (req, res) => {
  try {
    const { title, description, price, city, district, bedrooms, livingRooms } = req.body;

    if (!title || !description || !price || !city || !district || !req.file) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis." });
    }

    const newHouse = new House({
      title,
      description,
      price,
      bedrooms,
      livingRooms,
      city,
      district,
      imageUrl: `/uploads/${req.file.filename}`,
    });

    const savedHouse = await newHouse.save();
    res.status(201).json({ message: "Maison ajoutée avec succès.", house: savedHouse });

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