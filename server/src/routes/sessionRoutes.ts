import { Router } from "express";
import { getSession } from "../controllers/sessionController";

const router = Router();

router.get("/:sessionId", getSession);

export default router;
