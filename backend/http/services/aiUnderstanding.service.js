import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALLOWED_CATEGORIES } from "../constants/complaintCategories.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeComplaint(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const prompt = `
You are an AI system for a municipal corporation.

Return ONLY valid JSON.

{
  "category": "GARBAGE | WATER | SEWER | ROADS | STREET_LIGHT | OTHER",
  "summary": "short summary"
}

Complaint:
"${text}"
`;

  const result = await model.generateContent(prompt);
  const raw = result.response.text();

  const match = raw.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid AI response");

  const parsed = JSON.parse(match[0]);

  // 🔒 ENUM SAFETY
  const category = ALLOWED_CATEGORIES.includes(parsed.category)
    ? parsed.category
    : "OTHER";

  return {
    category,
    summary: parsed.summary || "",
  };
}
