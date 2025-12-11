import express from "express";
import { register, login } from "../controllers/authController.js";
import { validateRegister, validateLogin } from "../validators/authValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.post("/register", validateRegister, validateRequest, register);
router.post("/login", validateLogin, validateRequest, login);


router.get("/admin-only", verifyToken, checkRole("admin"), (req, res) => {
  res.json({ 
    message: "Welcome Admin!", 
    user: req.user 
  });
});

router.get("/driver-only", verifyToken, checkRole("driver"), (req, res) => {
  res.json({ 
    message: "Welcome Driver!", 
    user: req.user 
  });
});



export default router;
