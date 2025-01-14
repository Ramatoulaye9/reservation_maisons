const express = require('express');
const router = express.Router();
const Reservation = require('../modèles/reservation'); // Assure-toi que le chemin est correct

// Récupérer toutes les réservations d'un utilisateur connecté
router.get('/', async (req, res) => {
    try {
        const userId = req.user._id; // Suppose que l'utilisateur est authentifié et son ID est disponible
        const reservations = await Reservation.find({ userId }).populate('userId', 'noms email'); // Inclut les infos utilisateur si nécessaire
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des réservations.', error });
    }
});

// Ajouter une nouvelle réservation
router.post('/', async (req, res) => {
    try {
        const { reservationDate, status } = req.body;
        const userId = req.user._id; // ID de l'utilisateur connecté

        const newReservation = new Reservation({
            userId,
            reservationDate,
            status,
        });

        await newReservation.save();
        res.status(201).json(newReservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de la réservation.', error });
    }
});

// Modifier une réservation existante
router.put('/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;
        const updates = req.body;

        const updatedReservation = await Reservation.findByIdAndUpdate(
            reservationId,
            updates,
            { new: true } // Retourne le document mis à jour
        );

        if (!updatedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée." });
        }

        res.status(200).json(updatedReservation);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de la réservation.', error });
    }
});

// Supprimer une réservation
router.delete('/:id', async (req, res) => {
    try {
        const reservationId = req.params.id;

        const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

        if (!deletedReservation) {
            return res.status(404).json({ message: "Réservation non trouvée." });
        }

        res.status(200).json({ message: "Réservation supprimée avec succès." });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de la réservation.', error });
    }
});

module.exports = router;