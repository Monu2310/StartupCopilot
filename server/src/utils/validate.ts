import { z } from "zod";
import { HttpError } from "./httpError";

export const parseWithSchema = <S extends z.ZodTypeAny>(
  schema: S,
  payload: unknown
): z.infer<S> => {
  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    throw new HttpError(400, "Invalid request payload", "validation_error", {
      issues: parsed.error.issues
    });
  }
  return parsed.data;
};
