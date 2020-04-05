const mongoose = require('mongoose');
let mongooseHidden = require('mongoose-hidden')();

const notificationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    read: {
        type: Boolean,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        required: true
    },
    sender: {
        type: String,
        required: true
    }
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

notificationSchema.plugin(mongooseHidden);

let Notification = mongoose.model('notificationSchema', notificationSchema);
module.exports = Notification;