const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv"); // Pour charger les variables d'environnement
const app = express();
const userRoutes = require("./routes/userRoute");
const houseRoutes = require("./routes/houseRoute");
const reservationRoutes = require("./routes/reservationRoute");
const path = require("path"); // Importation de path
const cors = require("cors");
const fs = require("fs");  // Ajoute cette ligne au début de ton fichier

// Charger les variables d'environnement
dotenv.config(); 

// Vérifier/créer le dossier uploads localement
const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

app.use(express.json());

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
