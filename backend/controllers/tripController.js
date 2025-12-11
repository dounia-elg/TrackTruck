import Trip from "../models/Trip.js";
import User from "../models/User.js";
import Truck from "../models/Truck.js";

export const createTrip = async (req, res) => {
    try {
        const {
            lieuDepart,
            lieuArrivee,
            dateDepart,
            dateArrivee,
            chauffeur,
            camion,
            remorque,
        } = req.body;

        const driver = await User.findById(chauffeur);
        if (!driver || driver.role !== "driver") {
            return res.status(400).json({ error: "Chauffeur invalide" });
        }

        const truck = await Truck.findById(camion);
        if (!truck) {
            return res.status(404).json({ error: "Camion non trouvé" });
        }
        const trip = new Trip({
            lieuDepart,
            lieuArrivee,
            dateDepart,
            dateArrivee,
            chauffeur,
            camion,
            remorque,
        });
        await trip.save();
        const populatedTrip = await Trip.findById(trip._id)
            .populate("chauffeur", "name email")
            .populate("camion", "immatriculation modele")
            .populate("remorque", "immatriculation type");
        res.status(201).json({
            message: "Trajet créé avec succès",
            trip: populatedTrip,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};