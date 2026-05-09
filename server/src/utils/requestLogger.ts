import pinoHttp from "pino-http";
import { logger } from "./logger";

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"] as string,
  customSuccessMessage: () => "request_complete",
  customErrorMessage: () => "request_failed"
});
