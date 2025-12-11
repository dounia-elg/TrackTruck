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

export const updateTruck = async (req, res) => {
  try {
    const { immatriculation, modele, capaciteCarburant, kilometrage, statut } = req.body;
    const truck = await Truck.findByIdAndUpdate(
      req.params.id,
      {
        immatriculation,
        modele,
        capaciteCarburant,
        kilometrage,
        statut,
      },
      { new: true, runValidators: true }
    );
    if (!truck) {
      return res.status(404).json({ error: "Camion non trouvé" });
    }
    res.json({
      message: "Camion mis à jour avec succès",
      truck,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findByIdAndDelete(req.params.id);
    if (!truck) {
      return res.status(404).json({ error: "Camion non trouvé" });
    }
    res.json({
      message: "Camion supprimé avec succès",
      truck,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAllTrucks = async (req, res) => {
  try {
    const { statut } = req.query;
    
    const filter = {};
    if (statut) filter.statut = statut;
    const trucks = await Truck.find(filter).sort({ createdAt: -1 });
    res.json({
      count: trucks.length,
      trucks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTruckById = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ error: "Camion non trouvé" });
    }
    res.json(truck);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

