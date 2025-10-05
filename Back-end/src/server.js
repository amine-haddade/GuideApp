// src/server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import packRouter from "./Routes/packRoutes.js";

// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();

// Récupérer le port depuis le fichier .env, sinon utiliser 3000 par défaut
const port = process.env.PORT || 3000;

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        console.log('Continuing without database connection for testing...');
    }
};

connectDB();

// Middleware pour parser le JSON
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send(`Serveur lancé sur le port ${port}`);
});

// Routes
app.use('/api/packs/', packRouter);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
