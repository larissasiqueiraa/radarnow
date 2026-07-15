import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import {
  criarAvaliacao,
  listarAvaliacoes,
  atualizarAvaliacao,
  excluirAvaliacao,
} from "../controllers/avaliacoesController.js";

const router = express.Router();

const __filename = fileURLToPath(
  import.meta.url
);

const __dirname = path.dirname(
  __filename
);

const pastaMidias = path.join(
  __dirname,
  "..",
  "uploads",
  "midias"
);

if (!fs.existsSync(pastaMidias)) {
  fs.mkdirSync(pastaMidias, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    callback
  ) => {
    callback(null, pastaMidias);
  },

  filename: (
    req,
    file,
    callback
  ) => {
    const extensao = path
      .extname(file.originalname)
      .toLowerCase();

    const nomeArquivo =
      `midia-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${extensao}`;

    callback(null, nomeArquivo);
  },
});

const filtroArquivo = (
  req,
  file,
  callback
) => {
  const imagemPermitida =
    file.mimetype.startsWith("image/");

  const videoPermitido =
    file.mimetype.startsWith("video/");

  if (
    !imagemPermitida &&
    !videoPermitido
  ) {
    return callback(
      new Error(
        "Envie apenas uma foto ou vídeo."
      )
    );
  }

  callback(null, true);
};

const uploadMidia = multer({
  storage,
  fileFilter: filtroArquivo,
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
});

router.post(
  "/",
  uploadMidia.single("midia"),
  criarAvaliacao
);

router.get(
  "/:local_id",
  listarAvaliacoes
);

router.put(
  "/:id",
  atualizarAvaliacao
);

router.delete(
  "/:id",
  excluirAvaliacao
);

export default router;