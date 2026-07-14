import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  cadastrar,
  login,
  loginGoogle,
} from "../controllers/authController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaUploads = path.join(
  __dirname,
  "..",
  "uploads",
  "perfis"
);

if (!fs.existsSync(pastaUploads)) {
  fs.mkdirSync(pastaUploads, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, pastaUploads);
  },

  filename: (req, file, callback) => {
    const extensao = path.extname(
      file.originalname
    ).toLowerCase();

    const nomeArquivo = `perfil-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extensao}`;

    callback(null, nomeArquivo);
  },
});

const filtroArquivo = (req, file, callback) => {
  const tiposPermitidos = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!tiposPermitidos.includes(file.mimetype)) {
    return callback(
      new Error("Envie uma imagem JPG, PNG ou WEBP.")
    );
  }

  callback(null, true);
};

const uploadFotoPerfil = multer({
  storage,
  fileFilter: filtroArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

router.post(
  "/cadastro",
  uploadFotoPerfil.single("foto"),
  cadastrar
);

router.post("/login", login);
router.post("/google", loginGoogle);

export default router;