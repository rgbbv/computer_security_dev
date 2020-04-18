const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const crypto = require('crypto');
let PassVault = require('./passVault');
let Notification = require('./notification');
let mongooseHidden = require('mongoose-hidden')();

let userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: 'First name cannot be empty'
    },
    lastName: {
        type: String,
        required: 'Last name cannot be empty'
    },
    email: {
        type: String,
        required: 'Email cannot be empty',
        unique: true
    },
    security: {
        twoStepsVerification: {
            type: Boolean,
            default: false
        },
        secret: {
            type: String,
        }
    },
    passwords: [PassVault.schema],
    notifications: [Notification.schema],
    salt: {type: String, hide: true},
    hash: {type: String, hide: true}
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

userSchema.methods.generateJwt = function () {
    return jwt.sign({ id: this.id }, config.get("JWT_SECRET"), { expiresIn: config.get("JWT_EXP") });
};

userSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

userSchema.plugin(mongooseHidden);

let User = mongoose.model('User', userSchema);
module.exports = User;
