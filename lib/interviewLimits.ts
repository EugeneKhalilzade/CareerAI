export const FREE_INTERVIEW_LIMIT = 5;
export const FREE_MAX_DURATION_SECONDS = 180;

export function getInterviewStatus(interviewCount: number, plan: string) {
  if (plan === "free" && interviewCount >= 6) return "blocked";
  if (plan === "free" && interviewCount >= 3) return "warning";
  return "ok";
}
