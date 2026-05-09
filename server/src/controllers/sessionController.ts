import { asyncHandler } from "../utils/asyncHandler";
import { getSessionById } from "../services/sessionStore";

export const getSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const session = await getSessionById(sessionId);
  if (!session) {
    res.status(404).json({ error: "Session not found" });
    return;
  }
  res.json({ session });
});
