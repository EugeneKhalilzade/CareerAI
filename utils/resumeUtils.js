const MAX_DEFAULT_CHARS = 12000;
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export const RESUME_SUPPORTED_EXTENSIONS = ".pdf,.txt,.md,.docx";

const DOCX_MIME =
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

const SECTION_HEADINGS = [
  "Profile",
  "Summary",
  "Experience",
  "Education",
  "Skills",
  "Projects",
  "Interests",
  "Objective",
  "Certifications",
  "Awards",
];

const normalizeWhitespace = (text) => {
  const cleaned = text
    .replace(/\u00a0/g, " ")
    .replace(/[•●▪■◦‣⁃∙]/g, "-")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n");

  return cleaned
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
};

const addSectionBreaks = (text) => {
  let updated = text;
  SECTION_HEADINGS.forEach((heading) => {
    const pattern = new RegExp(`\\s${heading}\\s`, "g");
    updated = updated.replace(pattern, `\n\n${heading}\n`);
  });
  updated = updated.replace(/(\d{2}\/\d{4}\s*-\s*\d{2}\/\d{4})/g, "\n$1");
  updated = updated.replace(/\s-\s+/g, "\n- ");
  return updated;
};

export const normalizeResumeText = (text, maxChars = MAX_DEFAULT_CHARS) => {
  if (!text) return "";
  let cleaned = normalizeWhitespace(text);
  const lineCount = cleaned.split("\n").filter(Boolean).length;
  if (lineCount <= 2) {
    cleaned = addSectionBreaks(cleaned);
  }
  if (cleaned.length <= maxChars) return cleaned;
  return cleaned.slice(0, maxChars).trim();
};

const parsePdfText = async (file) => {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const data = new Uint8Array(await file.arrayBuffer());
  let pdf;
  try {
    pdf = await pdfjs.getDocument({ data }).promise;
  } catch (error) {
    pdf = await pdfjs.getDocument({ data, disableWorker: true }).promise;
  }
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const lines = [];
    let lineBuffer = "";
    let lastY = null;

    content.items.forEach((item) => {
      const text = String(item.str || "").trim();
      if (!text) return;
      const y = item.transform?.[5];
      const isNewLine = lastY !== null && y !== null && Math.abs(y - lastY) > 2;

      if (isNewLine && lineBuffer) {
        lines.push(lineBuffer);
        lineBuffer = "";
      }

      if (lineBuffer && !lineBuffer.endsWith(" ")) lineBuffer += " ";
      lineBuffer += text;
      lastY = y;

      if (item.hasEOL) {
        lines.push(lineBuffer);
        lineBuffer = "";
      }
    });

    if (lineBuffer) lines.push(lineBuffer);
    pages.push(lines.join("\n"));
  }

  const combined = pages.join("\n");
  if (!combined.trim()) {
    throw new Error("We couldn't extract text from that PDF.");
  }
  return combined;
};

const inferFileType = (file) => {
  if (file.type) return file.type;
  const name = file.name?.toLowerCase() || "";
  if (name.endsWith(".pdf")) return "application/pdf";
  if (name.endsWith(".txt")) return "text/plain";
  if (name.endsWith(".md")) return "text/markdown";
  if (name.endsWith(".docx")) return DOCX_MIME;
  return "";
};

const parseDocxText = async (file) => {
  const mammoth = await import("mammoth/mammoth.browser");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  if (!result?.value?.trim()) {
    throw new Error("We couldn't extract text from that Word document.");
  }
  return result.value;
};

export const extractResumeText = async (file, options = {}) => {
  if (!file) return "";
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("Please upload a resume file under 10MB.");
  }

  const { maxChars = MAX_DEFAULT_CHARS } = options;
  const fileType = inferFileType(file);

  if (fileType === "application/pdf") {
    const text = await parsePdfText(file);
    return normalizeResumeText(text, maxChars);
  }

  if (fileType === DOCX_MIME) {
    const text = await parseDocxText(file);
    return normalizeResumeText(text, maxChars);
  }

  if (fileType.startsWith("text/")) {
    const text = await file.text();
    return normalizeResumeText(text, maxChars);
  }

  throw new Error("Unsupported file type. Please upload a PDF, DOCX, or text file.");
};
