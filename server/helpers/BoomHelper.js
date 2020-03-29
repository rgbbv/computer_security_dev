const logger = require("../common/logger").winstonLogger;

class BoomHelper {

    static errorToBoom(res, err) {
        logger.error(err);

        switch (err.name) {
            case 'ValidationError': {
                res.boom.badData(err.message, err);
                break;
            }
            case 'JsonWebTokenError': {
                res.boom.unauthorized(err.message, err);
                break;
            }
            default:
                res.boom.internal(err.message, err);
        }
    }

    static apiResponseHandler(res, doc, err) {
        if (!err)
            res.json(doc);
        else {
            BoomHelper.errorToBoom(res, err);
        }
    }
}

module.exports = BoomHelper;