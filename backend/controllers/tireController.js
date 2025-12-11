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