import { body } from "express-validator";

export const validateRegister = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2 })
        .withMessage("Name must be at least 2 characters long"),

    body("role")
        .optional()
        .isIn(["admin", "driver"])
        .withMessage("Role must be either 'admin' or 'driver'"),
];

export const validateLogin = [
    body("email")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];