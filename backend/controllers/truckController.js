import Truck from "../models/Truck.js";

export const createTruck = async (req, res) => {
  try {
    const { immatriculation, modele, capaciteCarburant, kilometrage, statut } = req.body;

    const truck = new Truck({
      immatriculation,
      modele,
      capaciteCarburant,
      kilometrage,
      statut,
    });

    await truck.save();

    res.status(201).json({
      message: "Camion créé avec succès",
      truck,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

