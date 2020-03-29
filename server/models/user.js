const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const crypto = require('crypto');
let mongooseHidden = require('mongoose-hidden')();

let userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: 'First name cannot be empty'
    },
    last_name: {
        type: String,
        required: 'Last name cannot be empty'
    },
    email: {
        type: String,
        required: 'Email cannot be empty',
        unique: true
    },
    salt: {type: String, hide: true},
    hash: {type: String, hide: true}
});

userSchema.methods.generateJwt = function () {
    return jwt.sign({},
        config.get("JWT_SECRET"), { expiresIn: config.get("JWT_EXP") });
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