
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);
