const express = require('express');
const user = require('../modèles/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware');

const router = express.Router();
// const SECRET_KEY = 'secret_jwt_key'; //Stocker dans .env

//Inscription
router.post('/inscription', async (req,res)=>{
    try {
        const { noms, email, mdp, role } = req.body;

    //Vérifier si l'utilisateur existe déjà
    const utilisateurExistant = await user.findOne({ email });
    if (utilisateurExistant) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà!" });
    }
    //Créer l'utilisateur
        const newUser= await user.create({noms,email,mdp,role})
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

//Connexion
router.post('/connexion', async (req,res)=>{
    try {
        const {email,mdp} =req.body

        //Vérifier si l'utilisateur existe
        const utilisateur = await user.findOne({email});
        if(!utilisateur){
            return res.status(400).json({message: "Email ou mot de passe incorrect!"});
        }

        //Vérifier le mot de passe
        const estValide = await bcrypt.compare(mdp,utilisateur.mdp);
        if (!estValide){
            return res.status(400).json({message: "Email ou mot de passe incorrect!"});
        }

        //Générer un token JWT
        const token = jwt.sign({id: utilisateur._id, role: utilisateur.role}, process.env.SECRET_KEY, {expiresIn: '2h'});
        res.status(200).json({message: "Connexion réussie!", token, user: utilisateur});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

//Administrateur
router.get('/admin', authMiddleware, (req,res)=>{
    if (req.user.role !== 'admin'){
        return res.status(403).json({message: 'Accès refusé!'});
    }
    res.json({ message: "Bienvenue, administrateur"});
} )

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