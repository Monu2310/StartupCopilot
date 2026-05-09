import app from "../server/src/app";
import { connectMongo } from "../server/src/services/db/mongoose";

let mongoInitPromise: Promise<void> | null = null;

const ensureMongoConnection = async () => {
  if (!mongoInitPromise) {
    mongoInitPromise = connectMongo();
  }
  await mongoInitPromise;
};

export default async function handler(req: any, res: any) {
  await ensureMongoConnection();
  return app(req, res);
}
