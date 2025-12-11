import express from "express";
import {
  createTrip,
  getAllTrips,
  getMyTrips,
  updateTrip,
  updateTripStatus,
  deleteTrip,
} from "../controllers/tripController.js";
import { validateTrip, validateTripStatus } from "../validators/tripValidator.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { checkRole } from "../middleware/checkRole.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", checkRole("admin"), validateTrip, validateRequest, createTrip);
router.put("/:id", checkRole("admin"), validateTrip, validateRequest, updateTrip);
router.delete("/:id", checkRole("admin"), deleteTrip);
router.get("/", checkRole("admin"), getAllTrips);
router.patch("/:id/status", checkRole("admin", "driver"), validateTripStatus, validateRequest, updateTripStatus);
router.get("/my-trips", checkRole("driver"), getMyTrips);

export default router;