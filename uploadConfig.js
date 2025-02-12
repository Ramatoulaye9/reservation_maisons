// config/uploadConfig.js
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
dotenv.config();

// Configuration de Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// Configuration de Multer avec CloudinaryStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', // Dossier sur Cloudinary
    format: (req, file) => {
        const allowedFormats = ['jpg', 'jpeg', 'png'];
        const extname = path.extname(file.originalname).toLowerCase().slice(1);
        if (allowedFormats.includes(extname)) {
          return extname;
        }
        return 'jpg'; // Par défaut
      },
          public_id: (req, file) => file.originalname, // Utilisation du nom original du fichier
  },
});

const upload = multer({ storage });

module.exports = { upload };