const jwt = require('jsonwebtoken');

// 1. Csak bejelentkezetteknek
exports.protect = (req, res, next) => {
    // Itt csekkoljuk a tokent a headerben...
    next();
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