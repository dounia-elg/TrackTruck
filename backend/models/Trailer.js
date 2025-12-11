import mongoose from "mongoose";

const trailerSchema = new mongoose.Schema(
  {
    immatriculation: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["bâchée", "frigorifique", "citerne", "plateau", "autre"],
    },
    capaciteCharge: {
      type: Number,
      required: true,
      min: 0,
    },
    statut: {
      type: String,
      enum: ["disponible", "en service", "en maintenance", "hors service"],
      default: "disponible",
    },
    camionAssocie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Truck",
      default: null,
    },
  },
  { timestamps: true }
);

const Trailer = mongoose.model("Trailer", trailerSchema);
export default Trailer;