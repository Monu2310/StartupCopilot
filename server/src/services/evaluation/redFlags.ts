const RED_FLAG_KEYWORDS = [
  "high competition",
  "no monetization",
  "network effects needed",
  "regulatory risk",
  "low margins",
  "hard to acquire",
  "long sales cycle",
  "crowded market"
];

export const detectRedFlags = (text: string) => {
  const lower = text.toLowerCase();
  return RED_FLAG_KEYWORDS.filter((flag) => lower.includes(flag));
};
