import { z } from "zod";
import { createHash, randomUUID } from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { parseWithSchema } from "../utils/validate";
import { cacheGet, cacheSet } from "../services/cache/cache";
import { detectRedFlags } from "../services/evaluation/redFlags";
import { evaluateScores } from "../services/evaluation/scoring";
import {
  generateIdeaChain,
  improverChain,
  investorChain,
  roastChain
} from "../services/ai/chains";
import { RoastTone } from "../services/ai/types";
import { HttpError } from "../utils/httpError";
import { getOrCreateSession } from "../services/sessionStore";

const generateSchema = z.object({
  skills: z.string(),
  interests: z.string(),
  budget: z.string(),
  targetAudience: z.string(),
  geography: z.string(),
  context: z.string().optional(),
  sessionId: z.string().optional()
});

const analyzeSchema = z.object({
  idea: z.unknown(),
  context: z.string().optional(),
  tone: z.enum(["harder", "nicer", "neutral"]).optional(),
  sessionId: z.string().optional()
});

const roastSchema = z.object({
  idea: z.unknown(),
  tone: z.enum(["harder", "nicer", "neutral"]).optional(),
  sessionId: z.string().optional()
});

const hashPayload = (payload: unknown) =>
  createHash("sha256").update(JSON.stringify(payload)).digest("hex");

const compactText = (value: string, maxLength = 800) => {
  const trimmed = value.trim().replace(/\s+/g, " ");
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength);
};

const compactIdeaInput = (payload: {
  skills: string;
  interests: string;
  budget: string;
  targetAudience: string;
  geography: string;
  context?: string;
}) => ({
  skills: compactText(payload.skills, 300),
  interests: compactText(payload.interests, 300),
  budget: compactText(payload.budget, 200),
  targetAudience: compactText(payload.targetAudience, 300),
  geography: compactText(payload.geography, 200),
  context: payload.context ? compactText(payload.context, 600) : ""
});

export const generateIdea = asyncHandler(async (req, res) => {
  const payload = parseWithSchema(generateSchema, req.body);
  const session = await getOrCreateSession(payload.sessionId);

  const cacheKey = `idea:${hashPayload(payload)}`;
  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.json({ sessionId: session.sessionId, idea: cached });
    return;
  }

  const input = JSON.stringify(compactIdeaInput(payload));

  const idea = await generateIdeaChain(input);

  await cacheSet(cacheKey, idea);
  session.messages.push({ role: "user", content: input });
  session.messages.push({ role: "assistant", content: JSON.stringify(idea) });
  session.lastOutput = { idea };
  await session.save();

  res.json({ sessionId: session.sessionId, idea });
});

export const roastIdea = asyncHandler(async (req, res) => {
  const payload = parseWithSchema(roastSchema, req.body);
  if (!payload.idea) {
    throw new HttpError(400, "Missing idea input", "missing_idea");
  }
  const session = await getOrCreateSession(payload.sessionId);
  const tone: RoastTone = payload.tone || "neutral";

  const input = JSON.stringify({ idea: payload.idea, tone });
  const cacheKey = `roast:${hashPayload({ idea: payload.idea, tone })}`;

  const cached = await cacheGet(cacheKey);
  if (cached) {
    res.json({ sessionId: session.sessionId, roast: cached });
    return;
  }

  const roast = await roastChain(input, tone);

  await cacheSet(cacheKey, roast);
  session.messages.push({ role: "user", content: input });
  session.messages.push({ role: "assistant", content: JSON.stringify(roast) });
  session.lastOutput = { roast };
  await session.save();

  res.json({ sessionId: session.sessionId, roast });
});

export const analyzeIdea = asyncHandler(async (req, res) => {
  const payload = parseWithSchema(analyzeSchema, req.body);
  if (!payload.idea) {
    throw new HttpError(400, "Missing idea input", "missing_idea");
  }
  const session = await getOrCreateSession(payload.sessionId);
  const tone: RoastTone = payload.tone || "neutral";

  const input = JSON.stringify({
    idea: payload.idea,
    context: payload.context ? compactText(payload.context, 800) : ""
  });

  const roastKey = `roast:${hashPayload({ idea: payload.idea, tone })}`;
  const investorKey = `investor:${hashPayload(payload.idea)}`;
  const improverKey = `improver:${hashPayload(payload.idea)}`;

  const [roastCached, investorCached, improverCached] = await Promise.all([
    cacheGet(roastKey),
    cacheGet(investorKey),
    cacheGet(improverKey)
  ]);

  const roastPromise = roastCached
    ? Promise.resolve(roastCached)
    : roastChain(input, tone);
  const investorPromise = investorCached
    ? Promise.resolve(investorCached)
    : investorChain(input);
  const improverPromise = improverCached
    ? Promise.resolve(improverCached)
    : improverChain(input);

  const [roast, investor, improver] = await Promise.all([
    roastPromise,
    investorPromise,
    improverPromise
  ]);

  if (!roastCached) await cacheSet(roastKey, roast);
  if (!investorCached) await cacheSet(investorKey, investor);
  if (!improverCached) await cacheSet(improverKey, improver);

  const evaluation = evaluateScores(investor.scores);
  const red_flags = detectRedFlags(
    JSON.stringify({ roast, investor, improver, idea: payload.idea })
  );

  const response = {
    roast,
    investor,
    improver,
    evaluation,
    red_flags
  };

  session.messages.push({ role: "user", content: input });
  session.messages.push({ role: "assistant", content: JSON.stringify(response) });
  session.lastOutput = response;
  await session.save();

  res.json({ sessionId: session.sessionId, ...response });
});

export const analyzeIdeaStream = asyncHandler(async (req, res) => {
  const payload = parseWithSchema(analyzeSchema, req.body);
  if (!payload.idea) {
    throw new HttpError(400, "Missing idea input", "missing_idea");
  }
  const session = await getOrCreateSession(payload.sessionId);
  const tone: RoastTone = payload.tone || "neutral";

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const input = JSON.stringify({
    idea: payload.idea,
    context: payload.context ? compactText(payload.context, 800) : ""
  });

  const sendEvent = (event: string, data: unknown) => {
    res.write(`event: ${event}
`);
    res.write(`data: ${JSON.stringify(data)}

`);
  };

  try {
    const roast = await roastChain(input, tone);
    sendEvent("roast", roast);

    const investor = await investorChain(input);
    sendEvent("investor", investor);

    const improver = await improverChain(input);
    sendEvent("improver", improver);

    const evaluation = evaluateScores(investor.scores);
    const red_flags = detectRedFlags(
      JSON.stringify({ roast, investor, improver, idea: payload.idea })
    );

    const response = {
      roast,
      investor,
      improver,
      evaluation,
      red_flags
    };

    session.messages.push({ role: "user", content: input });
    session.messages.push({ role: "assistant", content: JSON.stringify(response) });
    session.lastOutput = response;
    await session.save();

    sendEvent("done", { sessionId: session.sessionId, ...response });
  } catch (error) {
    sendEvent("error", { message: (error as Error).message });
  } finally {
    res.end();
  }
});
