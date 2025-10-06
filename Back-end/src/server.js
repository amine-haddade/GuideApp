import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import packRouter from "./Routes/packRoutes.js";
import cookieParser from 'cookie-parser';
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import {errorHandler} from "./Middlewares/errorHandler.js";
import {notFound} from "./Middlewares/notFound.js";

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

// Routes
//app.use('/api/packs/', packRouter);
app.use("/api/packs", packRouter);
app.use("/api", userRoutes);

app.use(notFound);  
app.use(errorHandler);

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
