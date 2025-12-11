import express from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/register", validateRegister, validateRequest, register);
router.post("/login", validateLogin, validateRequest, login);


export default router;
