const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')();

const notificationSchema = new mongoose.Schema({
    db1: {   // date
        type: Date,
        required: true
    },
    dc: {   // read
        type: Boolean,
        required: true
    },
    dd: {   // content
        type: String,
        required: true
    },
    de: {   // severity
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    df: {   // sender
        type: String,
        required: true
    }
}, {
    toObject: { virtuals: true }
});

notificationSchema.plugin(mongooseHidden);

let Notification = mongoose.model('notificationSchema', notificationSchema);
module.exports = Notification;
