import express from "express";
import dotenv from "dotenv";
import packRouter from "./Routes/packRoutes.js";
import cookieParser from 'cookie-parser';
import connectDB from "./Config/db.js";
import guideRoutes from "./Routes/guidePlaceRoutes.js"
// Charger les variables d'environnement depuis .env
import userRoutes from "./Routes/userRoutes.js";
import bookingRoutes from './Routes/bookingRoutes.js';
//import packRouter from "./Routes/packRoutes";
import authRoutes from "./Routes/authRoutes.js";
import {errorHandler} from "./Middlewares/errorHandler.js";
import {notFound} from "./Middlewares/notFound.js";
import { verifyToken } from "./Middlewares/verifyJwtToken.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

connectDB();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cookieParser());

// Route test
app.get("/", (req, res) => {
  res.send(`Serveur lancé sur le port ${port}`);
});

// Guide Place Routes

// auth api
app.use("/api/guide-places",guideRoutes)

// Routes
// app.use('/api/packs/', packRouter);
app.use("/api/packs", packRouter);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(notFound);  
app.use(errorHandler);

// Démarrer le serveur  
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
