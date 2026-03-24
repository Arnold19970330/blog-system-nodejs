const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 👈 EZ HIÁNYZOTT!
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.signup = async (req, res) => {
    try {
        const newUser = await User.create({
            name: req.body.username, 
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || 'user'
        });

        const token = signToken(newUser._id);
        res.status(201).json({
            status: 'success',
            token,
            data: { user: newUser }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res) => {
    try { // 👈 Kerüljön bele a login is a biztonság kedvéért
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Kérlek adj meg emailt és jelszót!' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Helytelen email vagy jelszó!' });
        }

        const token = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: 'fail', message: 'Add meg az email címed.' });
        }

        const user = await User.findOne({ email }).select('+resetPasswordToken +resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ status: 'fail', message: 'Nincs ilyen email címmel felhasználó.' });
        }

        const rawToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 perc
        await user.save({ validateBeforeSave: false });

        // TODO: ide jon majd email kuldes. Most fejlesztoi valaszban visszaadjuk a linket.
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

        res.status(200).json({
            status: 'success',
            message: 'Jelszó-visszaállító link létrehozva.',
            data: { resetUrl }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ status: 'fail', message: 'Token és új jelszó megadása kötelező.' });
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        }).select('+password +resetPasswordToken +resetPasswordExpires');

        if (!user) {
            return res.status(400).json({ status: 'fail', message: 'Érvénytelen vagy lejárt visszaállító token.' });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        const authToken = signToken(user._id);
        res.status(200).json({
            status: 'success',
            token: authToken,
            message: 'Jelszó sikeresen módosítva.'
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};