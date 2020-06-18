const User = require('../models/user');
const Notification = require('../models/notification');

/**
 * Validates the operations against the user token payload, if some user is attempting to change a resource
 * that he is not own then report and return 403 ret code, otherwise permit to change the resource.
 * @param req
 * @param res
 * @param next
 */
module.exports.verifyUserAccess = function (req, res, next) {
    const unauthorizedMessage = "Unauthorized to change this resource! incidence have been reported!";
    const unauthorizedNotification = "We blocked an unauthorized activity. " +
        "User with ID: " + req.id + " tried to change your private information!";

    if (!req.authenticate || req.params.userId !== String(req.id)) {
        let notification = new Notification({db1: new Date(), dc: false, dd: unauthorizedNotification,
                                             de: 'High', df: 'System'});
        User.findByIdAndUpdate(req.params.userId, { $push: {ag: notification} }, {new: false},
            () => res.status(403).send({auth: false, message: unauthorizedMessage}))
    } else {
        next();
    }
};
