import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: undefined
});

export const logInfo = (message: string, meta?: Record<string, unknown>) => {
  logger.info(meta || {}, message);
};

export const logError = (message: string, meta?: Record<string, unknown>) => {
  logger.error(meta || {}, message);
};
