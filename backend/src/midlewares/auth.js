const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Csak bejelentkezetteknek
exports.protect = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ message: 'A művelethez be kell jelentkezned!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const currentUser = await User.findById(decoded.id);

        if (!currentUser) {
            return res.status(401).json({ message: 'A felhasználó már nem létezik.' });
        }

        req.user = currentUser;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Érvénytelen vagy lejárt token.' });
    }
};

// 2. Csak Adminoknak (pl. törléshez)
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Nincs jogosultságod ehhez a művelethez!' });
        }
        next();
    };
};