import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import db from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import favoritosRoutes from "./routes/favoritosRoutes.js";
import avaliacoesRoutes from "./routes/avaliacoesRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import googlePlacesRoutes from "./routes/googlePlacesRoutes.js";
import locaisRoutes from "./routes/locaisRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    projeto: "Radar Now",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/favoritos", favoritosRoutes);
app.use("/api/avaliacoes", avaliacoesRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/google-places", googlePlacesRoutes);
app.use("/api/locais", locaisRoutes);

async function testarBanco() {
  try {
    const connection = await db.getConnection();

    console.log("Banco conectado!");

    connection.release();
  } catch (error) {
    console.error(
      "Erro ao conectar no banco:",
      error.message
    );
  }
}

testarBanco();

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});