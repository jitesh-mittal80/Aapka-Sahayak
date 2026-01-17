// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { ALLOWED_CATEGORIES } from "../../constants/complaintCategories.js";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// export async function analyzeComplaint(text) {
//   const model = genAI.getGenerativeModel({
//     model: "gemini-2.5-flash", // ✅ WORKING MODEL
//   });

//   const prompt = `
// You are an AI system for a municipal corporation.

// Classify the complaint into EXACTLY ONE of these categories:
// GARBAGE, WATER, SEWER, ROADS, STREET_LIGHT, OTHER

// Return ONLY valid JSON.
// No explanation. No markdown.

// Example:
// {"category":"WATER","summary":"Water logging issue"}

// Complaint:
// "${text}"
// `;

//   const result = await model.generateContent(prompt);
//   const raw = result.response.text();

//   console.log("RAW AI RESPONSE:", raw);

//   const match = raw.match(/\{[\s\S]*\}/);
//   if (!match) throw new Error("Invalid AI response");

//   const parsed = JSON.parse(match[0]);

//   const normalizedCategory = parsed.category
//     ?.toUpperCase()
//     ?.replace(/\s+/g, "_");

//   const category = ALLOWED_CATEGORIES.includes(normalizedCategory)
//     ? normalizedCategory
//     : "OTHER";

//   return {
//     category,
//     summary: parsed.summary || "",
//   };
// }

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ALLOWED_CATEGORIES } from "../../constants/complaintCategories.js";
import { retry } from "../../utils/retry.js";
import { fallbackResponse } from "../../utils/fallback.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function analyzeComplaint(text) {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an AI system for a municipal corporation.

Classify the complaint into EXACTLY ONE of these categories:
GARBAGE, WATER, SEWER, ROADS, STREET_LIGHT, OTHER

Return ONLY valid JSON.
No explanation. No markdown.

Example:
{"category":"WATER","summary":"Water logging issue"}

Complaint:
"${text}"
`;

  try {
    // 🔁 RETRY APPLIED HERE
    const result = await retry(
      () => model.generateContent(prompt),
      3,
      1000
    );

    const raw = result.response.text();
    console.log("RAW AI RESPONSE:", raw);

    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI response");

    const parsed = JSON.parse(match[0]);

    const normalizedCategory = parsed.category
      ?.toUpperCase()
      ?.replace(/\s+/g, "_");

    const category = ALLOWED_CATEGORIES.includes(normalizedCategory)
      ? normalizedCategory
      : "OTHER";

    return {
      category,
      summary: parsed.summary || "",
    };

  } catch (error) {
    // 🛟 FALLBACK EXECUTES ONLY AFTER ALL RETRIES FAIL
    console.error("AI analysis failed completely:", error.message);

    return fallbackResponse();
  }
}

