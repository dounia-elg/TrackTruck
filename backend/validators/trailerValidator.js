import { body } from "express-validator";

export const validateTrailer = [
  body("immatriculation")
    .trim()
    .notEmpty()
    .withMessage("L'immatriculation est requise")
    .isLength({ min: 2, max: 20 })
    .withMessage("L'immatriculation doit contenir entre 2 et 20 caractères"),

  body("type")
    .notEmpty()
    .withMessage("Le type est requis")
    .isIn(["bâchée", "frigorifique", "citerne", "plateau", "autre"])
    .withMessage("Type de remorque invalide"),

  body("capaciteCharge")
    .isNumeric()
    .withMessage("La capacité de charge doit être un nombre")
    .isFloat({ min: 0 })
    .withMessage("La capacité de charge doit être positive"),

  body("statut")
    .optional()
    .isIn(["disponible", "en service", "en maintenance", "hors service"])
    .withMessage("Statut invalide"),

  body("camionAssocie")
    .optional()
    .isMongoId()
    .withMessage("ID de camion invalide"),
];