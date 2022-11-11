import winston from "winston";

const warnFilter = winston.format((info, opts) => { 
	return info.level === 'warn' ? info : false
})

const errorFilter = winston.format((info, opts) => { 
	return info.level === 'error' ? info : false
})

const logger = winston.createLogger({
    level: "info",
    defaultMeta: { service: "user-service" },
    transports: [
        new winston.transports.Console({
            level: "info", 
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
            ),
        }),
        new winston.transports.File({
            filename: "error.log",
            level: "error",
            dirname: "src/logs",
            format: winston.format.combine(
                winston.format.timestamp(),
                errorFilter(),
                winston.format.prettyPrint(),
            ),
        }),
        new winston.transports.File({
            filename: "warn.log",
            level: "warn",
            dirname: "src/logs",
            format: winston.format.combine(
                warnFilter(),
                winston.format.timestamp(),
                winston.format.prettyPrint(),
            )
        }),
    ],
});

export default logger;