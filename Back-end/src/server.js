// src/server.js
import express from "express";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();

// Récupérer le port depuis le fichier .env, sinon utiliser 3000 par défaut
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send(` Serveur lancé sur le port ${port}`);
});



// Démarrer le serveur
app.listen(port, () => {
  console.log(` Serveur démarré sur http://localhost:${port}`);
});
