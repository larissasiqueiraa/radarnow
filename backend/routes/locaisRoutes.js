import express from "express";
import {
  listarLocais,
  buscarLocalPorId,
} from "../controllers/locaisController.js";

const router = express.Router();

router.get("/", listarLocais);
router.get("/:id", buscarLocalPorId);

export default router;