import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.resolve(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },

  filename: (req, file, cb) => {
    const nomeSeguro = file.originalname
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9._-]/g, "");

    const nomeUnico = `${Date.now()}-${nomeSeguro}`;

    cb(null, nomeUnico);
  },
});

function filtroArquivo(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Apenas arquivos de imagem são permitidos."));
  }

  cb(null, true);
}

export const upload = multer({
  storage,
  fileFilter: filtroArquivo,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});