import mongoose from "mongoose";
import { randomUUID } from "crypto";
import { IdeaSession } from "../models/IdeaSession";

type SessionMessage = {
  role: string;
  content: string;
  createdAt?: Date;
};

type SessionRecord = {
  sessionId: string;
  messages: SessionMessage[];
  lastOutput?: unknown;
  createdAt?: Date;
  updatedAt?: Date;
  save: () => Promise<void>;
};

const memorySessions = new Map<string, SessionRecord>();

const isMongoReady = () => mongoose.connection.readyState === 1;

const cloneSession = (session: SessionRecord): SessionRecord => ({
  sessionId: session.sessionId,
  messages: session.messages.map((message) => ({ ...message })),
  lastOutput: session.lastOutput,
  createdAt: session.createdAt,
  updatedAt: session.updatedAt,
  save: session.save
});

const createMemorySession = (sessionId: string) => {
  const session: SessionRecord = {
    sessionId,
    messages: [],
    save: async () => {
      session.updatedAt = new Date();
      memorySessions.set(sessionId, cloneSession(session));
    }
  };

  memorySessions.set(sessionId, session);
  return session;
};

export const getOrCreateSession = async (sessionId?: string) => {
  const id = sessionId || randomUUID();

  if (!isMongoReady()) {
    return memorySessions.get(id) || createMemorySession(id);
  }

  const session =
    (await IdeaSession.findOne({ sessionId: id })) ||
    (await IdeaSession.create({ sessionId: id, messages: [] }));

  return session as unknown as SessionRecord;
};

export const getSessionById = async (sessionId: string) => {
  if (!isMongoReady()) {
    return memorySessions.get(sessionId) || null;
  }

  return IdeaSession.findOne({ sessionId }).lean();
};

export const saveSession = async (session: SessionRecord) => {
  if (!isMongoReady()) {
    session.updatedAt = new Date();
    memorySessions.set(session.sessionId, cloneSession(session));
    return;
  }

  await (session as unknown as { save: () => Promise<void> }).save();
};
