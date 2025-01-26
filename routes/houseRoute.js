const express = require("express");
const Maison = require("../modèles/house");
const mongoose = require("mongoose");
const router = express.Router();

// Ajouter une maison
const { title, description, price, imageUrl, location, bedrooms, livingRooms } = req.body;
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // dossier où les fichiers seront enregistrés
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // nom unique pour chaque fichier
  },
});

const upload = multer({ storage });

app.post('/houses/ajout', upload.single('image'), (req, res) => {
  const { title, description, price, bedrooms, livingRooms, location } = req.body;
  const imagePath = req.file ? req.file.path : null;

  if (!title || !description || !price || !location) {
    return res.status(400).json({
      message: "Les champs 'title', 'description', 'price', et 'location' sont obligatoires.",
    });
  }

  // Enregistrer les données dans la base de données (exemple)
  const newHouse = {
    title,
    description,
    price,
    bedrooms,
    livingRooms,
    location,
    imageUrl: imagePath,
  };

  // Simuler l'ajout dans la base de données
  res.status(201).json({ message: 'Maison ajoutée avec succès', house: newHouse });
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