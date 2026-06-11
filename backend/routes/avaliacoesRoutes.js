import express from "express";
import {
  criarAvaliacao,
  listarAvaliacoes,
} from "../controllers/avaliacoesController.js";

const router = express.Router();

router.post("/", criarAvaliacao);
router.get("/:local_id", listarAvaliacoes);

export default router;