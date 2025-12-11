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

export const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate("chauffeur", "name email")
            .populate("camion", "immatriculation modele")
            .populate("remorque", "immatriculation type");
        if (!trip) {
            return res.status(404).json({ error: "Trajet non trouvé" });
        }
        res.json({
            message: "Trajet mis à jour avec succès",
            trip,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const deleteTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndDelete(req.params.id);
        if (!trip) {
            return res.status(404).json({ error: "Trajet non trouvé" });
        }
        res.json({
            message: "Trajet supprimé avec succès",
            trip,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllTrips = async (req, res) => {
  try {
    const { statut, chauffeur, dateDepart } = req.query;
    const filter = {};
    if (statut) filter.statut = statut;
    if (chauffeur) filter.chauffeur = chauffeur;
    if (dateDepart) {
      const startDate = new Date(dateDepart);
      const endDate = new Date(dateDepart);
      endDate.setDate(endDate.getDate() + 1);
      filter.dateDepart = { $gte: startDate, $lt: endDate };
    }
    const trips = await Trip.find(filter)
      .populate("chauffeur", "name email")
      .populate("camion", "immatriculation modele")
      .populate("remorque", "immatriculation type")
      .sort({ dateDepart: -1 });
    res.json({
      count: trips.length,
      trips,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTripStatus = async (req, res) => {
  try {
    const { statut, kilometrageDepart, kilometrageArrivee, consommationCarburant, remarques } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trajet non trouvé" });
    }
   
    if (req.user.role === "driver" && trip.chauffeur.toString() !== req.user.id) {
      return res.status(403).json({ error: "Accès non autorisé" });
    }
    
    if (statut) trip.statut = statut;
    if (kilometrageDepart !== undefined) trip.kilometrageDepart = kilometrageDepart;
    if (kilometrageArrivee !== undefined) trip.kilometrageArrivee = kilometrageArrivee;
    if (consommationCarburant !== undefined) trip.consommationCarburant = consommationCarburant;
    if (remarques !== undefined) trip.remarques = remarques;
    
    if (trip.kilometrageDepart && trip.kilometrageArrivee) {
      trip.distanceParcourue = trip.kilometrageArrivee - trip.kilometrageDepart;
    }
    await trip.save();
    const updatedTrip = await Trip.findById(trip._id)
      .populate("chauffeur", "name email")
      .populate("camion", "immatriculation modele")
      .populate("remorque", "immatriculation type");
    res.json({
      message: "Statut du trajet mis à jour",
      trip: updatedTrip,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
