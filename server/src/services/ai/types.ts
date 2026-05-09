export type IdeaGeneratorInput = {
  skills: string;
  interests: string;
  budget: string;
  targetAudience: string;
  geography: string;
  context?: string;
};

export type RoastTone = "harder" | "nicer" | "neutral";

export type IdeaPayload = {
  idea_name: string;
  problem: string;
  solution: string;
  target_users: string;
  monetization: string;
  mvp_plan: string[];
  differentiation: string;
};

export type RoastPayload = {
  summary: string;
  roast: string;
  fatal_flaws: string[];
  market_gaps: string[];
  bad_assumptions: string[];
  verdict: string;
};

export type InvestorPayload = {
  market_analysis: {
    target_customer: string;
    market_size: string;
    competition: string;
    entry_barriers: string;
  };
  scores: {
    feasibility: number;
    scalability: number;
    uniqueness: number;
    execution_complexity: number;
  };
  risks: string[];
  opportunities: string[];
  final_verdict: string;
};

export type ImproverPayload = {
  improved_idea: string;
  pivot_suggestions: string[];
  feature_additions: string[];
  go_to_market_strategy: string[];
};
