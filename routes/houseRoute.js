const express = require('express');
const Maison = require('../modèles/house');
const router = express.Router();

// Ajouter une maison
router.post('/ajout', async (req, res) => {
    try {
        const {title, description, price, imageUrl } = req.body;

        // Validation manuelle
        if (!nom || !quartier || !prix) {
            return res.status(400).json({
                message: "Les champs 'nom', 'quartier', et 'prix' sont obligatoires.",
            });
        }

        // Création de la maison
        const nouvelleMaison = new Maison({ title, description, price, imageUrl });
        const maisonSave = await nouvelleMaison.save();
        res.status(201).json(maisonSave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Récupérer toutes les maisons
router.get('/', async (req, res) => {
    try {
        const maisons = await Maison.find();
        if (!maisons || maisons.length === 0) {
            return res.status(404).json({ message: "Aucune maison trouvée." });
        }
        res.status(200).json(maisons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Modifier une maison
router.put('/:id', async (req, res) => {
    try {
        const maisonId = req.params.id; // ID de la maison à modifier
        const { title, description, price, imageUrl } = req.body; // Champs à modifier

        // Recherche et mise à jour de la maison
        const maisonModifiee = await Maison.findByIdAndUpdate(
            maisonId, // ID à chercher
            { title, description, price, imageUrl }, // Nouveaux champs
            { new: true, runValidators: true } // Retourne le document mis à jour
        );

        if (!maisonModifiee) {
            return res.status(404).json({ message: "Maison introuvable." });
        }

        res.status(200).json(maisonModifiee); // Retourne la maison mise à jour
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Supprimer une maison
router.delete('/:id', async (req, res) => {
    try {
        const maisonId = req.params.id; // ID de la maison à supprimer

        // Recherche et suppression de la maison
        const maisonSupprimee = await Maison.findByIdAndDelete(maisonId);

        if (!maisonSupprimee) {
            return res.status(404).json({ message: "Maison introuvable." });
        }

        res.status(200).json({ message: "Maison supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;