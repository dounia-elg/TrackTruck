import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    lieuDepart: {
      type: String,
      required: true,
      trim: true,
    },
    lieuArrivee: {
      type: String,
      required: true,
      trim: true,
    },
    dateDepart: {
      type: Date,
      required: true,
    },
    dateArrivee: {
      type: Date,
      required: true,
    },
    chauffeur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    remorque: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trailer",
      default: null,
    },
    statut: {
      type: String,
      enum: ["à faire", "en cours", "terminé"],
      default: "à faire",
    },
    kilometrageDepart: {
      type: Number,
      default: null,
      min: 0,
    },
    kilometrageArrivee: {
      type: Number,
      default: null,
      min: 0,
    },
    distanceParcourue: {
      type: Number,
      default: 0,
      min: 0,
    },
    consommationCarburant: {
      type: Number,
      default: 0,
      min: 0,
    },
    remarques: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;