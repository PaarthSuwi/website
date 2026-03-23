const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "tracelink-india-secret-key-2026");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ success: false, error: "Invalid or expired token." });
    }
};

const isAdmin = (req, res, next) => {
    authenticate(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ success: false, error: "Access denied. Admin privileges required." });
        }
        next();
    });
};

module.exports = { authenticate, isAdmin };
