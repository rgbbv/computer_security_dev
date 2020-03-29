const jwt = require('jsonwebtoken');
const config = require("config");
const logger = require("../common/logger").winstonLogger;

module.exports.verifyJwtToken = (req, res, next) => {
    let token;
    if ('authorization' in req.headers) {
        token = req.headers['authorization'].split(' ')[1];
    }
    if (!token) return res.status(403).send({auth: false, message: 'No token provided!'});
    else {
        jwt.verify(token, config.get('JWT_SECRET'), (err, decoded) => {
            if (err) {
                logger.error(err);
                return res.status(500).send({auth: false, message: 'Token authentication failed.'});
            }
            else {
                req.id = decoded.id;
                next();
            }
        })
    }
};