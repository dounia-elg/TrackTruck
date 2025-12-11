import Tire from "../models/Tire.js";
import Truck from "../models/Truck.js";

export const createTire = async (req, res) => {
  try {
    const {
      camion,
      position,
      marque,
      reference,
      dateInstallation,
      kilometrageInstallation,
    } = req.body;
    // Verify truck exists
    const truck = await Truck.findById(camion);
    if (!truck) {
      return res.status(404).json({ error: "Camion non trouvé" });
    }
    const tire = new Tire({
      camion,
      position,
      marque,
      reference,
      dateInstallation,
      kilometrageInstallation,
    });
    await tire.save();
    res.status(201).json({
      message: "Pneu installé avec succès",
      tire,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateTire = async (req, res) => {
  try {
    const { usure, statut } = req.body;
    const tire = await Tire.findByIdAndUpdate(
      req.params.id,
      { usure, statut },
      { new: true, runValidators: true }
    ).populate("camion", "immatriculation modele");
    if (!tire) {
      return res.status(404).json({ error: "Pneu non trouvé" });
    }
    res.json({
      message: "Pneu mis à jour avec succès",
      tire,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
