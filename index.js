const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Pour charger les variables d'environnement
const app = express();
const userRoutes = require("./routes/userRoute");
const houseRoutes = require("./routes/houseRoute");
const reservationRoutes = require("./routes/reservationRoute");
const path = require("path"); // Importation de path
const cors = require("cors");
const express = require('express');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv'); // Charger les variables d'environnement

dotenv.config(); // Charger les variables du fichier .env

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

// Configuration de Multer avec CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Dossier sur Cloudinary
    format: async (req, file) => 'png', // Format (modifiable en fonction des besoins)
    public_id: (req, file) => file.originalname, // Utilisation du nom original du fichier
  },
});

const upload = multer({ storage });

// Vérifier/créer le dossier uploads localement
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(express.json());

// Route d'upload de fichier vers Cloudinary
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier téléchargé.' });
  }

  res.json({
    message: 'Fichier uploadé avec succès !',
    fileUrl: req.file.path // URL du fichier sur Cloudinary
  });
});


dotenv.config(); // Charger les variables d'environnement depuis un fichier .env

app.use(express.json()); // Middleware pour traiter les requêtes JSON

// app.use(express.urlencoded({ extended: true }));
const corsOptions = {
  origin: "http://localhost:4200", // ou utilisez '*' pour autoriser toutes les origines (attention en prod)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/", (req, res) => {
  res.send("Salut, API");
});

// Serve the 'uploads' folder as static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/houses", houseRoutes);
app.use("/users", userRoutes);
app.use("/reservations", reservationRoutes);

// Vérifiez si la variable d'environnement pour MongoDB est définie
if (!process.env.MONGO_ENV) {
  console.error("La variable d'environnement MONGO_ENV n'est pas définie.");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_ENV)
  .then(() => {
    console.log("Connexion à MongoDB réussie!");
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log("Le serveur démarre au port: 3000");
    });
  })
  .catch((error) => {
    console.error("Connexion échouée :", error.message);
  });
