const mongoose = require('mongoose');
const config = require("config");
const logger = require("./logger").winstonLogger;

const DB_USER = config.get('DB.DB_USER');
const DB_PASSWORD = config.get('DB.DB_PASSWORD');
const DB_NAME = config.get('DB.DB_NAME');
const uri = "mongodb+srv://" + DB_USER + ":" + DB_PASSWORD + "@compseccluster-032wl.mongodb.net/" + DB_NAME + "?retryWrites=true&w=majority";

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);

mongoose.connect(uri)
    .then(() => logger.info("MongoDB Connection to DB: " + DB_NAME + " Succeeded."))
    .catch((err) => logger.error("Error in DB Connection: " + JSON.stringify(err, undefined, 2)));

module.exports = mongoose;