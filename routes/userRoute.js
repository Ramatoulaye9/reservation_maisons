const express = require('express');
const user = require('../modèles/user')
const router = express.Router();

router.post('/inscription', async (req,res)=>{
    try {
        const { noms, email, mdp } = req.body;

    //Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await user.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà!" });
    }

        const newUser= await user.create({noms,email,mdp})
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await user.find();
        if (!users || users.length === 0) {
            return res.status(404).json({ message: "Aucun utilisateur trouvé." });
        }
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Modifier un utilisateur
router.put('/:id', async (req, res) => {
    try {
        const utilisateurId = req.params.id; // ID de l'utilisateur à modifier
        const { noms, email, mdp } = req.body; // Champs à modifier

        // Rechercher et mettre à jour l'utilisateur
        const utilisateurModifie = await user.findByIdAndUpdate(
            utilisateurId,
            { noms, email, mdp },
            { new: true, runValidators: true } // Retourner l'utilisateur mis à jour et appliquer les validateurs
        );

        if (!utilisateurModifie) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json(utilisateurModifie);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Supprimer un utilisateur
router.delete('/:id', async (req, res) => {
    try {
        const utilisateurId = req.params.id; // ID de l'utilisateur à supprimer

        // Rechercher et supprimer l'utilisateur
        const utilisateurSupprime = await user.findByIdAndDelete(utilisateurId);

        if (!utilisateurSupprime) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json({ message: "Utilisateur supprimé avec succès." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;