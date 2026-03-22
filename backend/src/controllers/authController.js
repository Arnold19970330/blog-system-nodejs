const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // 👈 EZ HIÁNYZOTT!

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
        res.status(200).json({ status: 'success', token });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};