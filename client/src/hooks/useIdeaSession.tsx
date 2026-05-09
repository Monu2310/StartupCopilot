import React, { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";
import { AnalysisResponse, IdeaPayload } from "../types";

type Tone = "harder" | "nicer" | "neutral";

type ChatMessage = { role: "user" | "assistant"; content: string };

type IdeaSessionState = {
  sessionId?: string;
  idea?: IdeaPayload;
  analysis?: AnalysisResponse;
  chat: ChatMessage[];
  generateIdea: (payload: {
    skills: string;
    interests: string;
    budget: string;
    targetAudience: string;
    geography: string;
  }) => Promise<void>;
  analyzeIdea: (payload: { idea: IdeaPayload; tone: Tone; context?: string }) => Promise<void>;
  addChatMessage: (message: ChatMessage) => void;
};

const IdeaSessionContext = createContext<IdeaSessionState | null>(null);

export const IdeaSessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [sessionId, setSessionId] = useState<string>();
  const [idea, setIdea] = useState<IdeaPayload>();
  const [analysis, setAnalysis] = useState<AnalysisResponse>();
  const [chat, setChat] = useState<ChatMessage[]>([]);

  const generateIdea = async (payload: {
    skills: string;
    interests: string;
    budget: string;
    targetAudience: string;
    geography: string;
  }) => {
    const response = await api.post("/idea/generate", {
      ...payload,
      sessionId
    });
    setSessionId(response.data.sessionId);
    setIdea(response.data.idea);
    setChat((prev) => [
      ...prev,
      { role: "user", content: JSON.stringify(payload) },
      { role: "assistant", content: JSON.stringify(response.data.idea) }
    ]);
  };

  const analyzeIdea = async (payload: {
    idea: IdeaPayload;
    tone: Tone;
    context?: string;
  }) => {
    const response = await api.post("/idea/analyze", {
      idea: payload.idea,
      tone: payload.tone,
      context: payload.context,
      sessionId
    });
    setSessionId(response.data.sessionId);
    setAnalysis(response.data);
    setChat((prev) => [
      ...prev,
      { role: "user", content: payload.context || "Analyze idea" },
      { role: "assistant", content: JSON.stringify(response.data) }
    ]);
  };

  const addChatMessage = (message: ChatMessage) => {
    setChat((prev) => [...prev, message]);
  };

  const value = useMemo(
    () => ({
      sessionId,
      idea,
      analysis,
      chat,
      generateIdea,
      analyzeIdea,
      addChatMessage
    }),
    [sessionId, idea, analysis, chat]
  );

  return (
    <IdeaSessionContext.Provider value={value}>
      {children}
    </IdeaSessionContext.Provider>
  );
};

export const useIdeaSession = () => {
  const context = useContext(IdeaSessionContext);
  if (!context) {
    throw new Error("useIdeaSession must be used within IdeaSessionProvider");
  }
  return context;
};
