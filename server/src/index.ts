import { config } from "dotenv";
import app from "./app";
import { connectMongo } from "./services/db/mongoose";
import { logInfo, logError } from "./utils/logger";

config();

const port = Number(process.env.PORT || 4000);

const start = async () => {
  await connectMongo();
  app.listen(port, () => {
    logInfo("api_listening", { port });
  });
};

start().catch((error) => {
  logError("server_start_failed", { message: error.message });
  process.exit(1);
});
