const { createLogger, format, transports } = require('winston');
const config = require("config");

class Logger {

    constructor() {
        this.winstonLogger = createLogger({
            level: config.get("LOGGER.LEVEL"),
            format: format.combine(
                format.colorize(),
                format.json()
            ),
            transports: [
                 new transports.Console({format: format.simple()})
             ]
        });

        config.get("LOGGER.TRANSPORTS").forEach((transport) => {
            if (transport['TYPE'] === 'file') {
                this.winstonLogger.add(new transports.File({
                    filename: transport['FILE_RELATIVE_PATH'],
                    level: transport['LEVEL']
                }));
            }
        });
    }
}

// Export the logger
module.exports = new Logger();
