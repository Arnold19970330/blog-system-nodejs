const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        resetPasswordToken: { type: String, select: false },
        resetPasswordExpires: { type: Date, select: false },
        role: { 
            type: String, 
            enum: ['user', 'admin'], 
            default: 'user' 
        }
    },
    {
        timestamps: true
    }
);

// Jelszó titkosítása mentés előtt
userSchema.pre('save', async function() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);