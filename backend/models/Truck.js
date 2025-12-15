import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    immatriculation: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    modele: {
      type: String,
      required: true,
    },
    capaciteCarburant: {
      type: Number,
      required: true,
      min: 0,
    },
    kilometrage: {
      type: Number,
      default: 0,
      min: 0,
    },
    prochainEntretien: { 
      type: Number, 
      default: 30000 
    },
    statut: {
      type: String,
      enum: ["disponible", "en service", "en maintenance", "hors service"],
      default: "disponible",
    },
  },
  { timestamps: true }
);

const Truck = mongoose.model("Truck", truckSchema);
export default Truck;