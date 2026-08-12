import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(
  import.meta.url
);

const __dirname = path.dirname(
  __filename
);

const estaNoRailway = Boolean(
  process.env.RAILWAY_PROJECT_ID ||
  process.env.RAILWAY_ENVIRONMENT_NAME
);

const uploadsDir = estaNoRailway
  ? "/app/uploads"
  : path.resolve(
      __dirname,
      "../uploads"
    );

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    callback
  ) => {
    callback(null, uploadsDir);
  },

  filename: (
    req,
    file,
    callback
  ) => {
    const nomeSeguro =
      file.originalname
        .replace(/\s+/g, "-")
        .replace(
          /[^a-zA-Z0-9._-]/g,
          ""
        );

    const nomeUnico =
      `${Date.now()}-${nomeSeguro}`;

    callback(null, nomeUnico);
  },
});

function filtroArquivo(
  req,
  file,
  callback
) {
  if (
    !file.mimetype.startsWith(
      "image/"
    )
  ) {
    return callback(
      new Error(
        "Apenas arquivos de imagem são permitidos."
      )
    );
  }

  callback(null, true);
}

export const upload = multer({
  storage,

  fileFilter:
    filtroArquivo,

  limits: {
    fileSize:
      5 * 1024 * 1024,
  },
});