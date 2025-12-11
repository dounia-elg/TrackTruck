import mongoose from "mongoose";

const tireSchema = new mongoose.Schema(
  {
    camion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      required: true,
    },
    position: {
      type: String,
      required: true,
      enum: [
        "avant gauche",
        "avant droit",
        "arrière gauche 1",
        "arrière gauche 2",
        "arrière droit 1",
        "arrière droit 2",
      ],
    },
    marque: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    dateInstallation: {
      type: Date,
      required: true,
      default: Date.now,
    },
    kilometrageInstallation: {
      type: Number,
      required: true,
      min: 0,
    },
    usure: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    statut: {
      type: String,
      enum: ["bon", "moyen", "usé", "à remplacer"],
      default: "bon",
    },
    dateRemplacement: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const Tire = mongoose.model("Tire", tireSchema);
export default Tire;