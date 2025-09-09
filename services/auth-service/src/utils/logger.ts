import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export default logger;

// This code sets up a logger using the winston library.
// It configures the logger to log messages at the "info" level and above.
// The log messages are formatted as JSON by default, but console logs are in a simple text format.
// The logger has three transports:
// 1. Console transport: Logs all messages to the console in a simple format.
// 2. File transport for errors: Logs only error-level messages to "error.log".
// 3. File transport for all logs: Logs all messages to "combined.log".
// Finally, the logger is exported for use in other parts of the application.
