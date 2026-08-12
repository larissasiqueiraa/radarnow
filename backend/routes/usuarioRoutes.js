import express from "express";

import {
  buscarPerfil,
  atualizarUsuario,
  excluirConta,
} from "../controllers/usuarioController.js";

import {
  upload,
} from "../middlewares/upload.js";

import {
  autenticarUsuario,
} from "../middlewares/autenticacao.js";

const router = express.Router();

router.delete(
  "/conta",
  autenticarUsuario,
  excluirConta
);

router.get(
  "/:id",
  buscarPerfil
);

router.put(
  "/:id",
  upload.single("foto"),
  atualizarUsuario
);

export default router;