import express from "express";
import cors from "cors";
import helmet from "helmet";
import ideaRoutes from "./routes/ideaRoutes";
import sessionRoutes from "./routes/sessionRoutes";
import { apiRateLimiter } from "./middleware/rateLimit";
import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";
import { requestId } from "./middleware/requestId";
import { requestLogger } from "./utils/requestLogger";

const app = express();

app.use(helmet());
app.use(cors());
app.use(requestId);
app.use(requestLogger);
app.use(express.json({ limit: "2mb" }));
app.use(apiRateLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/idea", ideaRoutes);
app.use("/api/session", sessionRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
