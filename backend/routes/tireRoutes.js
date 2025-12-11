import express from "express";
import {
    createTire,
    getAllTires,
    updateTire,
    deleteTire,
} from "../controllers/tireController.js";
import { validateTire, validateTireUpdate } from "../validators/tireValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();


router.use(verifyToken);


router.post("/", checkRole("admin"), validateTire, validateRequest, createTire);
router.put("/:id", checkRole("admin"), validateTireUpdate, validateRequest, updateTire);
router.delete("/:id", checkRole("admin"), deleteTire);
router.get("/", checkRole("admin"), getAllTires);


export default router;