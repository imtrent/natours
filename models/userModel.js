const crypto = require('crypto');
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
    role: {
        type: 'String',
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user'
    },
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        deafult: true,
        select: false
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

userSchema.pre('save', function(next) {
    // If password was not modified, or if the document is new, just return
    if (!this.isModified('password') || this.isNew) return next();

    // Set password changed at to current time
    this.passwordChangedAt = Date.now() - 1000;

    next();
});

userSchema.pre(/^find/, function(next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// Check if the password was changed after current JWT token creation
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    // Check if passwordChangedAt has a value
    // Compare the JWTTimestamp with the changedTimeStamp

    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp;
    }
    // False means that the password was not changed
    return false;
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function() {
    // Generate random string for reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Encrypt and store hashed reset token on user document
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // Expire is 10 minutes after token was created
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
