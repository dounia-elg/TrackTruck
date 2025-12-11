import express from "express";
import {
    createTrailer,
    getAllTrailers,
    getTrailerById,
    updateTrailer,
    deleteTrailer,
} from "../controllers/trailerController.js";
import { validateTrailer } from "../validators/trailerValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();


router.use(verifyToken);

router.post("/", checkRole("admin"), validateTrailer, validateRequest, createTrailer);
router.put("/:id", checkRole("admin"), validateTrailer, validateRequest, updateTrailer);
router.delete("/:id", checkRole("admin"), deleteTrailer);
router.get("/", checkRole("admin", "driver"), getAllTrailers);
router.get("/:id", checkRole("admin", "driver"), getTrailerById);


export default router;