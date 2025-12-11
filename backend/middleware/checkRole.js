
export const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        try {

            if (!req.user) {
                return res.status(401).json({ error: "Unauthorized. Please login." });
            }


            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({
                    error: "Forbidden. You don't have permission to access this resource."
                });
            }

            next();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    };
};