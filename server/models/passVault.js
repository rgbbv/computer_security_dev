const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')();

// TODO: add email to schema (user and email not required), change url to website
const passVaultSchema = new mongoose.Schema({
    ca: {   // url
        type: String,
        required: true
    },
    cc: {   // username
        type: String,
        required: true
    },
    cb: {   // password
        type: String,
        required: true
    }
});

passVaultSchema.plugin(mongooseHidden);

let PassVault = mongoose.model('passVaultSchema', passVaultSchema);
module.exports = PassVault;
