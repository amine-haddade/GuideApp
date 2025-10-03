import express from "express";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser';
import connectDB from "./Config/db.js";
import userRoutes from "./Routes/userRoutes.js";
import {errorHandler} from "./Middlewares/errorHandler.js";
import {notFound} from "./Middlewares/notFound.js";

dotenv.config();

const app = express();

connectDB();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use("/api", userRoutes);

// Route test
app.get("/", (req, res) => {
  res.send(` Serveur lancé sur le port ${port}`);
});

app.use(notFound);  
app.use(errorHandler);

// Démarrer le serveur
app.listen(port, () => {
  console.log(` Serveur démarré sur http://localhost:${port}`);
});
