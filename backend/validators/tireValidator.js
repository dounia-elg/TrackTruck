import { body } from "express-validator";

export const validateTire = [
  body("camion")
    .notEmpty()
    .withMessage("L'ID du camion est requis")
    .isMongoId()
    .withMessage("ID de camion invalide"),

  body("position")
    .notEmpty()
    .withMessage("La position est requise")
    .isIn([
      "avant gauche",
      "avant droit",
      "arrière gauche 1",
      "arrière gauche 2",
      "arrière droit 1",
      "arrière droit 2",
    ])
    .withMessage("Position invalide"),

  body("marque")
    .trim()
    .notEmpty()
    .withMessage("La marque est requise"),

  body("reference")
    .trim()
    .notEmpty()
    .withMessage("La référence est requise"),

  body("kilometrageInstallation")
    .isNumeric()
    .withMessage("Le kilométrage doit être un nombre")
    .isFloat({ min: 0 })
    .withMessage("Le kilométrage doit être positif"),

  body("dateInstallation")
    .optional()
    .isISO8601()
    .withMessage("Date invalide"),
];

export const validateTireUpdate = [
  body("usure")
    .optional()
    .isNumeric()
    .withMessage("L'usure doit être un nombre")
    .isFloat({ min: 0, max: 100 })
    .withMessage("L'usure doit être entre 0 et 100"),

  body("statut")
    .optional()
    .isIn(["bon", "moyen", "usé", "à remplacer"])
    .withMessage("Statut invalide"),
];