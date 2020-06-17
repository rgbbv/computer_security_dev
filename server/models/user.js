const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require("config");
const crypto = require('crypto');
let PassVault = require('./passVault');
let Notification = require('./notification');
let mongooseHidden = require('mongoose-hidden')();

let userSchema = new mongoose.Schema({
    ac: {   // first name
        type: String,
        required: 'First name cannot be empty'
    },
    ad: {   // last name
        type: String,
        required: 'Last name cannot be empty'
    },
    ae: {   // email
        type: String,
        required: 'Email cannot be empty',
        unique: true
    },
    ab: {   // security
        ba: {   // twoStepsVerification
            type: Boolean,
            default: false
        },
        bb: {   // secret
            type: String,
            hide: true
        }
    },
    af: [PassVault.schema], // passwords
    ag: [Notification.schema],  // notifications
    ah: {type: String, hide: true}, // salt
    ai: {type: String, hide: true} // hash
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

userSchema.methods.generateJwt = function (payload = {}) {
    return jwt.sign(payload, config.get("JWT_SECRET"), { expiresIn: config.get("JWT_EXP") });
};

userSchema.methods.setPassword = function(password) {
    this.ah = crypto.randomBytes(16).toString('hex');
    this.ai = crypto.pbkdf2Sync(password, this.ah, 10000, 512, 'sha512').toString('hex');
};

userSchema.methods.validPassword = function(password) {
    let ai = crypto.pbkdf2Sync(password, this.ah, 10000, 512, 'sha512').toString('hex');
    return this.ai === ai;
};

userSchema.plugin(mongooseHidden);

let User = mongoose.model('User', userSchema);
module.exports = User;
