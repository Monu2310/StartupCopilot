import { ZodSchema } from "zod";
import { HttpError } from "./httpError";

export const parseWithSchema = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid request payload", "validation_error", {
      issues: parsed.error.issues
    });
  }
  return parsed.data;
};
