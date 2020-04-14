const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')();

// TODO: add email to schema (user and email not required), change url to website
const passVaultSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

passVaultSchema.plugin(mongooseHidden);

let PassVault = mongoose.model('passVaultSchema', passVaultSchema);
module.exports = PassVault;
