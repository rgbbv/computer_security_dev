const mongoose = require('mongoose');

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

let PassVault = mongoose.model('passVaultSchema', passVaultSchema);
module.exports = PassVault;