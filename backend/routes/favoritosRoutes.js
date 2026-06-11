import express from "express";
import {
  adicionarFavorito,
  listarFavoritos,
  removerFavorito,
} from "../controllers/favoritosController.js";

const router = express.Router();

router.post("/", adicionarFavorito);
router.get("/:usuario_id", listarFavoritos);
router.delete("/:usuario_id/:local_id", removerFavorito);

export default router;