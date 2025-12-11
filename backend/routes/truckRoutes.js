import express from "express";
import {
    createTruck,
    getAllTrucks,
    getTruckById,
    updateTruck,
    deleteTruck,
} from "../controllers/truckController.js";
import { validateTruck } from "../validators/truckValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();


router.use(verifyToken);

router.post("/", checkRole("admin"), validateTruck, validateRequest, createTruck);
router.put("/:id", checkRole("admin"), validateTruck, validateRequest, updateTruck);
router.delete("/:id", checkRole("admin"), deleteTruck);
router.get("/", checkRole("admin", "driver"), getAllTrucks);
router.get("/:id", checkRole("admin", "driver"), getTruckById);


export default router;