import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

export const getLLM = (temperature = 0.4) => {
  if (process.env.GROQ_API_KEY) {
    return new ChatGroq({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature,
      apiKey: process.env.GROQ_API_KEY
    });
  }

  if (process.env.GEMINI_API_KEY) {
    return new ChatGoogleGenerativeAI({
      model: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      temperature,
      apiKey: process.env.GEMINI_API_KEY
    });
  }

  return new ChatOpenAI({
    model: process.env.OPENAI_MODEL || "gpt-4o",
    temperature
  });
};
