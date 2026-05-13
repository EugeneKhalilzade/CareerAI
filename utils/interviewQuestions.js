const QUESTION_ARRAY_KEYS = [
  "interviewQuestions",
  "questions",
  "mockInterviewQuestions",
  "data",
  "items",
];

const QUESTION_KEYS = ["question", "Question", "q", "prompt"];
const ANSWER_KEYS = ["answer", "Answer", "correctAnswer", "sampleAnswer", "idealAnswer"];

function stripCodeFence(value) {
  return value.replace("```json", "").replace("```", "").trim();
}

function parseJson(value) {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function toText(value) {
  if (typeof value === "string") return value.trim();
  if (value === null || value === undefined) return "";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return "";
}

function getFirstDefinedValue(source, keys) {
  if (!source || typeof source !== "object") return "";
  for (const key of keys) {
    const value = toText(source[key]);
    if (value) return value;
  }
  return "";
}

function toQuestionArray(parsed) {
  if (Array.isArray(parsed)) return parsed;
  if (!parsed || typeof parsed !== "object") return [];

  for (const key of QUESTION_ARRAY_KEYS) {
    if (Array.isArray(parsed[key])) return parsed[key];
  }

  const firstArrayValue = Object.values(parsed).find((value) => Array.isArray(value));
  return Array.isArray(firstArrayValue) ? firstArrayValue : [];
}

function normalizeQuestionItem(item, index) {
  if (typeof item === "string") {
    return { question: item.trim(), answer: "" };
  }

  if (!item || typeof item !== "object") {
    return { question: "", answer: "" };
  }

  const question = getFirstDefinedValue(item, QUESTION_KEYS);
  const answer = getFirstDefinedValue(item, ANSWER_KEYS);

  return {
    question,
    answer,
    order: index + 1,
  };
}

export function normalizeInterviewQuestions(rawPayload) {
  if (rawPayload === null || rawPayload === undefined) return [];

  let parsed = rawPayload;

  if (typeof parsed === "string") {
    parsed = parseJson(stripCodeFence(parsed));
  }

  if (typeof parsed === "string") {
    parsed = parseJson(stripCodeFence(parsed));
  }

  const questionArray = toQuestionArray(parsed);

  return questionArray
    .map((item, index) => normalizeQuestionItem(item, index))
    .filter((item) => item.question);
}

