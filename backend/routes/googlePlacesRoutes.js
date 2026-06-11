import express from "express";
import {
  buscarLugaresGoogle,
  importarLugaresGoogle,
  buscarFotoGoogle,
  atualizarFotosLocais,
} from "../controllers/googlePlacesController.js";

const router = express.Router();

router.get("/", buscarLugaresGoogle);
router.post("/importar", importarLugaresGoogle);
router.get("/foto", buscarFotoGoogle);
router.post("/atualizar-fotos", atualizarFotosLocais);

export default router;