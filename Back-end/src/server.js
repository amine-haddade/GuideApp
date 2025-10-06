// src/server.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./Config/db.js";
import guideRoutes from "./Routes/guidePlaceRoutes.js"
// Charger les variables d'environnement depuis .env
dotenv.config();

const app = express();
connectDB()
// Récupérer le port depuis le fichier .env, sinon utiliser 3000 par défaut
const port = process.env.PORT || 3000;

// Middleware pour parser le JSON
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send(` Serveur lancé sur le port ${port}`);
});

// Guide Place Routes

// auth api
app.use("/api/guide-places",guideRoutes)



// Démarrer le serveur
app.listen(port, () => {
  console.log(` Serveur démarré sur http://localhost:${port}`);
});
