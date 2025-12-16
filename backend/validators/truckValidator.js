import { body } from "express-validator";

export const validateTruck = [
  body("immatriculation")
    .trim()
    .notEmpty()
    .withMessage("L'immatriculation est requise")
    .isLength({ min: 2, max: 20 })
    .withMessage("L'immatriculation doit contenir entre 2 et 20 caractères"),

  body("modele")
    .trim()
    .notEmpty()
    .withMessage("Le modèle est requis"),

  body("capaciteCarburant")
    .isNumeric()
    .withMessage("La capacité de carburant doit être un nombre")
    .isFloat({ min: 0 })
    .withMessage("La capacité de carburant doit être positive"),

  body("kilometrage")
    .optional()
    .isNumeric()
    .withMessage("Le kilométrage doit être un nombre")
    .isFloat({ min: 0 })
    .withMessage("Le kilométrage doit être positif"),

  body("statut")
    .optional()
    .isIn(["disponible", "en service", "en maintenance", "hors service"])
    .withMessage("Statut invalide"),

  body("maintenanceRules")
    .optional()
    .isArray()
    .withMessage("Les règles de maintenance doivent être un tableau"),

  body("maintenanceRules.*.type")
    .notEmpty()
    .withMessage("Le type de maintenance est requis"),

  body("maintenanceRules.*.intervalKm")
    .isNumeric()
    .withMessage("L'intervalle doit être un nombre"),

  body("maintenanceRules.*.lastKm")
    .optional()
    .isNumeric()
    .withMessage("Le dernier kilométrage doit être un nombre"),
];