import mongoose from "mongoose";
import { logger } from "../../utils/logger";

export const connectMongo = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    logger.warn({ message: "MONGO_URI is not set" }, "mongo_unavailable");
    return;
  }

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    logger.warn(
      {
        message: (error as Error).message,
        reason: "mongodb_connection_failed"
      },
      "mongo_unavailable"
    );
  }
};
