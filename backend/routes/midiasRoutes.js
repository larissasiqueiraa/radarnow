import express from "express";

import {
  listarMidiasDoLocal,
  criarMidia,
  excluirMidia,
} from "../controllers/midiasController.js";

const router = express.Router();

router.get("/local/:localId", listarMidiasDoLocal);
router.post("/", criarMidia);
router.delete("/:id", excluirMidia);

export default router;