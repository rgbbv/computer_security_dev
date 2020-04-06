const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')();

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
});

passVaultSchema.plugin(mongooseHidden);

let PassVault = mongoose.model('passVaultSchema', passVaultSchema);
module.exports = PassVault;