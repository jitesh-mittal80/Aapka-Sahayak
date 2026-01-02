import express from "express";
import twilio from "twilio";
import { PrismaClient } from "@prisma/client";
import { analyzeComplaint } from "../services/aiUnderstanding.service.js";

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;
const prisma = new PrismaClient();
router.post("/incoming-call", (req, res) => {
  const twiml = new VoiceResponse();

  const gather = twiml.gather({
    input: "speech",
    action: "/voice/complaint-text",
    method: "POST",
    language: "en-IN",
    speechTimeout: "auto",
  });

  gather.say(
    "Welcome to Aapka Sahayak. Please tell us your complaint after the beep."
  );

  // Fallback if no speech
  twiml.say("We did not receive your complaint. Please try again.");

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

    let finalCategory = "OTHER";

    // 🧠 AI (NON-BLOCKING)
    try {
      const aiResult = await analyzeComplaint(speechText);
      finalCategory = aiResult.category;

      await prisma.complaint.update({
        where: { id: complaint.id },
        data: { category: finalCategory },
      });
    } catch (aiErr) {
      console.error("AI error:", aiErr.message);
    }

    // ✅ ALWAYS respond to Twilio
    twiml.say(
      `Thank you. I have registered your complaint related to ${finalCategory
        .replace("_", " ")
        .toLowerCase()}. Our team will take action shortly.`
    );
  } catch (err) {
    console.error("Webhook crash:", err.message);

    // 🚑 LAST RESORT
    twiml.say(
      "Your complaint has been recorded. We faced a temporary issue, but our team will take action."
    );
  }

  res.type("text/xml");
  res.send(twiml.toString());
});
export default router;
