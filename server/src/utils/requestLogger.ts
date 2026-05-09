import pinoHttp from "pino-http";

export const requestLogger = pinoHttp({
  genReqId: (req) => req.headers["x-request-id"] as string,
  customSuccessMessage: () => "request_complete",
  customErrorMessage: () => "request_failed"
});
