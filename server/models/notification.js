const mongoose = require('mongoose');

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
    }
});

let Notification = mongoose.model('notificationSchema', notificationSchema);
module.exports = Notification;