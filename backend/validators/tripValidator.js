import { body } from "express-validator";

export const validateTrip = [
    body("lieuDepart")
        .trim()
        .notEmpty()
        .withMessage("Le lieu de départ est requis"),

    body("lieuArrivee")
        .trim()
        .notEmpty()
        .withMessage("Le lieu d'arrivée est requis"),

    body("dateDepart")
        .notEmpty()
        .withMessage("La date de départ est requise")
        .isISO8601()
        .withMessage("Date de départ invalide"),

    body("dateArrivee")
        .notEmpty()
        .withMessage("La date d'arrivée est requise")
        .isISO8601()
        .withMessage("Date d'arrivée invalide")
        .custom((value, { req }) => {
            if (new Date(value) <= new Date(req.body.dateDepart)) {
                throw new Error("La date d'arrivée doit être après la date de départ");
            }
            return true;
        }),

    body("chauffeur")
        .notEmpty()
        .withMessage("Le chauffeur est requis")
        .isMongoId()
        .withMessage("ID de chauffeur invalide"),

    body("camion")
        .notEmpty()
        .withMessage("Le camion est requis")
        .isMongoId()
        .withMessage("ID de camion invalide"),

    body("remorque")
        .optional()
        .isMongoId()
        .withMessage("ID de remorque invalide"),
];

export const validateTripStatus = [
    body("statut")
        .optional()
        .isIn(["à faire", "en cours", "terminé"])
        .withMessage("Statut invalide"),

    body("kilometrageDepart")
        .optional()
        .isNumeric()
        .withMessage("Le kilométrage de départ doit être un nombre")
        .isFloat({ min: 0 })
        .withMessage("Le kilométrage doit être positif"),

    body("kilometrageArrivee")
        .optional()
        .isNumeric()
        .withMessage("Le kilométrage d'arrivée doit être un nombre")
        .isFloat({ min: 0 })
        .withMessage("Le kilométrage doit être positif"),

    body("consommationCarburant")
        .optional()
        .isNumeric()
        .withMessage("La consommation doit être un nombre")
        .isFloat({ min: 0 })
        .withMessage("La consommation doit être positive"),
];