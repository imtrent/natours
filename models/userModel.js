const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email address'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: 8,
        select: false
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This only works on create and save
            validator: function(el) {
                return el === this.password;
            },
            message: 'Passwords do not match'
        }
    }
});

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    // Set password to encrypted version of password
    this.password = await bcrypt.hash(this.password, 12);

    // Delete confirmed password after passwords have been confirmed
    // and password has been encrypted
    this.passwordConfirm = undefined;

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
