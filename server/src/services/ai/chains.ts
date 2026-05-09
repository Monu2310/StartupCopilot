import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";
import { jsonrepair } from "jsonrepair";
import {
  ideaGeneratorSystem,
  improverSystem,
  investorSystem,
  roastSystemBase
} from "./prompts";
import { getLLM } from "./llm";
import { RoastTone } from "./types";

const extractJsonCandidates = (text: string) => {
  const candidates: string[] = [];
  const fencedJson = /```json\s*([\s\S]*?)```/gi;
  const fencedAny = /```\s*([\s\S]*?)```/gi;

  let match = fencedJson.exec(text);
  while (match) {
    candidates.push(match[1]);
    match = fencedJson.exec(text);
  }

  match = fencedAny.exec(text);
  while (match) {
    candidates.push(match[1]);
    match = fencedAny.exec(text);
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1 && end > start) {
    candidates.push(text.slice(start, end + 1));
  }

  return candidates.map((candidate) => candidate.trim()).filter(Boolean);
};

const runStructured = async <T>(
  system: string,
  schema: z.ZodTypeAny,
  input: string,
  temperature = 0.4
): Promise<T> => {
  const model = getLLM(temperature);
  const parser = StructuredOutputParser.fromZodSchema(schema as any) as {
    getFormatInstructions: () => string;
    parse: (text: string) => Promise<T>;
  };

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", `${system}\n{format_instructions}`],
    ["human", "{input}"]
  ]);

  const promptText = await prompt.format({
    input,
    format_instructions: parser.getFormatInstructions()
  });
  const response = await model.invoke(promptText);
  const content =
    typeof response.content === "string"
      ? response.content
      : JSON.stringify(response.content);

  try {
    return await parser.parse(content);
  } catch {
    const candidates = extractJsonCandidates(content).reverse();
    for (const candidate of candidates) {
      try {
        const parsed = JSON.parse(candidate);
        return schema.parse(parsed) as T;
      } catch {
        try {
          const repaired = jsonrepair(candidate);
          const parsed = JSON.parse(repaired);
          return schema.parse(parsed) as T;
        } catch {
          continue;
        }
      }
    }

    const repairPrompt = ChatPromptTemplate.fromMessages([
      [
        "system",
        "You fix malformed model outputs. Return a single JSON object only. No markdown or explanations."
      ],
      ["human", "{format_instructions}\nRaw:\n{raw}"]
    ]);

    const repairPromptText = await repairPrompt.format({
      format_instructions: parser.getFormatInstructions(),
      raw: content
    });

    const repairedResponse = await model.invoke(repairPromptText);
    const repairedContent =
      typeof repairedResponse.content === "string"
        ? repairedResponse.content
        : JSON.stringify(repairedResponse.content);

    const repairedCandidates = extractJsonCandidates(repairedContent).reverse();
    for (const candidate of repairedCandidates) {
      try {
        const parsed = JSON.parse(candidate);
        return schema.parse(parsed) as T;
      } catch {
        try {
          const repaired = jsonrepair(candidate);
          const parsed = JSON.parse(repaired);
          return schema.parse(parsed) as T;
        } catch {
          continue;
        }
      }
    }

    throw new Error("Model response was not valid JSON");
  }
};

const ideaSchema = z.object({
  idea_name: z.string(),
  problem: z.string(),
  solution: z.string(),
  target_users: z.string(),
  monetization: z.string(),
  mvp_plan: z.array(z.string()),
  differentiation: z.string()
});

const roastSchema = z.object({
  summary: z.string(),
  roast: z.string(),
  fatal_flaws: z.array(z.string()),
  market_gaps: z.array(z.string()),
  bad_assumptions: z.array(z.string()),
  verdict: z.string()
});

const investorSchema = z.object({
  market_analysis: z.object({
    target_customer: z.string(),
    market_size: z.string(),
    competition: z.string(),
    entry_barriers: z.string()
  }),
  scores: z.object({
    feasibility: z.number().min(1).max(10),
    scalability: z.number().min(1).max(10),
    uniqueness: z.number().min(1).max(10),
    execution_complexity: z.number().min(1).max(10)
  }),
  risks: z.array(z.string()),
  opportunities: z.array(z.string()),
  final_verdict: z.string()
});

const improverSchema = z.object({
  improved_idea: z.string(),
  pivot_suggestions: z.array(z.string()),
  feature_additions: z.array(z.string()),
  go_to_market_strategy: z.array(z.string())
});

export type IdeaOutput = z.infer<typeof ideaSchema>;
export type RoastOutput = z.infer<typeof roastSchema>;
export type InvestorOutput = z.infer<typeof investorSchema>;
export type ImproverOutput = z.infer<typeof improverSchema>;

export const generateIdeaChain = async (input: string): Promise<IdeaOutput> => {
  return runStructured<IdeaOutput>(ideaGeneratorSystem, ideaSchema, input, 0.6);
};

const toneSuffix: Record<RoastTone, string> = {
  harder: "Increase the harshness. Point out brutal flaws and bad economics.",
  nicer: "Be constructive and softer in tone, but still honest.",
  neutral: ""
};

export const roastChain = async (input: string, tone: RoastTone): Promise<RoastOutput> => {
  const system = `${roastSystemBase} ${toneSuffix[tone]}`.trim();
  return runStructured<RoastOutput>(system, roastSchema, input, 0.7);
};

export const investorChain = async (input: string): Promise<InvestorOutput> => {
  return runStructured<InvestorOutput>(investorSystem, investorSchema, input, 0.3);
};

export const improverChain = async (input: string): Promise<ImproverOutput> => {
  return runStructured<ImproverOutput>(improverSystem, improverSchema, input, 0.5);
};
