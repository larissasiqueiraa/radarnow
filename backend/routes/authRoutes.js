import express from "express";
import {
  cadastrar,
  login,
  loginGoogle,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/cadastro", cadastrar);
router.post("/login", login);
router.post("/google", loginGoogle);

export default router;