import { Router } from "express";
import {
  analyzeIdea,
  analyzeIdeaStream,
  generateIdea,
  roastIdea
} from "../controllers/ideaController";

const router = Router();

router.post("/generate", generateIdea);
router.post("/roast", roastIdea);
router.post("/analyze", analyzeIdea);
router.post("/analyze/stream", analyzeIdeaStream);

export default router;
