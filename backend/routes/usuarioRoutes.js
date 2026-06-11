import express from "express";
import {
  buscarPerfil,
  atualizarUsuario,
} from "../controllers/usuarioController.js";

import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/:id", buscarPerfil);

// 👇 AQUI está a correção principal
router.put("/:id", upload.single("foto"), atualizarUsuario);

export default router;