import express from "express";
import twilio from "twilio";
import { PrismaClient } from "@prisma/client";
import { analyzeComplaint } from "../../http/services/aiUnderstanding.service.js";
import { ALLOWED_CATEGORIES } from "../../constants/complaintCategories.js";

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;
const prisma = new PrismaClient();

router.post("/capture-complaint", (req, res) => {
  const twiml = new VoiceResponse();

  twiml.say(
    {
      voice: "alice",
      language: "en-IN",
    },
    "Please clearly describe your complaint after the beep. You have 30 seconds."
  );

  twiml.gather({
    input: "speech",
    timeout: 5,
    speechTimeout: "auto",
    maxSpeechTime: 30,
    action: "/voice/complaint-text",
    method: "POST",
    language: "en-IN",
  });

  res.type("text/xml");
  res.send(twiml.toString());
});

router.post("/complaint-text", async (req, res) => {
  const twiml = new VoiceResponse();

  try {
    const speechText = req.body.SpeechResult;
    const callerPhone = req.body.From;

    if (!speechText) {
      twiml.say("Sorry, I could not understand your complaint.");
      res.type("text/xml");
      return res.send(twiml.toString());
    }

    const citizen = await prisma.citizen.findFirst({
      where: { phone: callerPhone },
    });

    if (!citizen) {
      twiml.say("We could not find your profile. Please register first.");
      res.type("text/xml");
      return res.send(twiml.toString());
    }

    // ✅ Always save complaint first
    const complaint = await prisma.complaint.create({
      data: {
        description: speechText,
        category: "UNCLASSIFIED",
        citizenId: citizen.id,
      },
    });

    // 🧠 AI PART (OPTIONAL, NON-BLOCKING)
    try {
      const aiResult = await analyzeComplaint(speechText);

      await prisma.complaint.update({
        where: { id: complaint.id },
        data: { category: aiResult.category },
      });
    } catch (aiError) {
      console.error("AI failed:", aiError.message);
      // DO NOTHING — system continues
    }

    // ✅ ALWAYS respond to Twilio
    twiml.say(
      "Thank you. Your complaint has been successfully recorded. Our team will take action shortly."
    );
  } catch (err) {
    console.error("Webhook failed:", err.message);

    // 🚑 LAST RESORT RESPONSE
    twiml.say(
      "Your complaint has been recorded, but we faced a temporary issue. Our team will still take action."
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
});


export default router;