import Trailer from "../models/Trailer.js";

export const createTrailer = async (req, res) => {
  try {
    const { immatriculation, type, capaciteCharge, statut, camionAssocie } = req.body;

    const trailer = new Trailer({
      immatriculation,
      type,
      capaciteCharge,
      statut,
      camionAssocie,
    });

    await trailer.save();

    res.status(201).json({
      message: "Remorque créée avec succès",
      trailer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const updateTrailer = async (req, res) => {
  try {
    const { immatriculation, type, capaciteCharge, statut, camionAssocie } = req.body;

    const trailer = await Trailer.findByIdAndUpdate(
      req.params.id,
      {
        immatriculation,
        type,
        capaciteCharge,
        statut,
        camionAssocie,
      },
      { new: true, runValidators: true }
    ).populate("camionAssocie", "immatriculation modele");

    if (!trailer) {
      return res.status(404).json({ error: "Remorque non trouvée" });
    }

    res.json({
      message: "Remorque mise à jour avec succès",
      trailer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteTrailer = async (req, res) => {
  try {
    const trailer = await Trailer.findByIdAndDelete(req.params.id);

    if (!trailer) {
      return res.status(404).json({ error: "Remorque non trouvée" });
    }

    res.json({
      message: "Remorque supprimée avec succès",
      trailer,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getAllTrailers = async (req, res) => {
  try {
    const { statut, type } = req.query;

    const filter = {};
    if (statut) filter.statut = statut;
    if (type) filter.type = type;

    const trailers = await Trailer.find(filter)
      .populate("camionAssocie", "immatriculation modele")
      .sort({ createdAt: -1 });

    res.json({
      count: trailers.length,
      trailers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const getTrailerById = async (req, res) => {
  try {
    const trailer = await Trailer.findById(req.params.id)
      .populate("camionAssocie", "immatriculation modele");

    if (!trailer) {
      return res.status(404).json({ error: "Remorque non trouvée" });
    }

    res.json(trailer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};