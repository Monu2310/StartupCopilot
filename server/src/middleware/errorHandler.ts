import { NextFunction, Request, Response } from "express";
import { HttpError } from "../utils/httpError";
import { logError } from "../utils/logger";

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const httpError = error instanceof HttpError ? error : null;
  const upstreamStatus =
    (error as { status?: number; statusCode?: number }).status ||
    (error as { status?: number; statusCode?: number }).statusCode;
  const status = httpError?.statusCode || upstreamStatus || 500;
  const message = httpError?.message || error.message || "Unexpected server error";
  let code = httpError?.code || "internal_error";

  if (!httpError && status === 429) {
    code = "openai_quota";
  }

  logError("request_error", {
    message: error.message,
    status,
    code: httpError?.code
  });

  res.status(status).json({
    error: message,
    code,
    details: httpError?.details
  });
};
