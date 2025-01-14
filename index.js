const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); // Pour charger les variables d'environnement
const app = express();
const userRoutes = require('./routes/userRoute')
const houseRoutes = require('./routes/houseRoute')

dotenv.config(); // Charger les variables d'environnement depuis un fichier .env

app.use(express.json()); // Middleware pour traiter les requêtes JSON

// app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Salut, API");
});

app.use('/houses', houseRoutes)
app.use('/users', userRoutes)

// Vérifiez si la variable d'environnement pour MongoDB est définie
if (!process.env.MONGO_ENV) {
    console.error("La variable d'environnement MONGO_ENV n'est pas définie.");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_ENV)
    .then(() => {
        console.log("Connexion à MongoDB réussie!");
        app.listen(3000, () => {
            console.log('Le serveur démarre au port: 3000');
        });
    })
    .catch((error) => {
        console.error("Connexion échouée :", error.message);
    });