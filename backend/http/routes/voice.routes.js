import express from "express";
import twilio from "twilio";
import { PrismaClient } from "@prisma/client";

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

  const speechText = req.body.SpeechResult;
  const confidence = req.body.Confidence;
  const callerPhone = req.body.From; // Twilio caller number

  if (!speechText) {
    twiml.say(
      { voice: "alice", language: "en-IN" },
      "Sorry, I could not understand your complaint. Please try again."
    );
    twiml.redirect("/voice/capture-complaint");

    res.type("text/xml");
    return res.send(twiml.toString());
  }

  // 🔹 TEMP citizen fetch (we improve this later)
  const citizen = await prisma.citizen.findFirst({
    where: { phone: callerPhone },
  });

  if (!citizen) {
    twiml.say(
      { voice: "alice", language: "en-IN" },
      "We could not find your profile. Please register first."
    );

    res.type("text/xml");
    return res.send(twiml.toString());
  }

  // ✅ SAVE COMPLAINT
  await prisma.complaint.create({
    data: {
        description: speechText,
        category: "UNCLASSIFIED", // AI will fill later
        citizenId: citizen.id,
    },
  });

  twiml.say(
    { voice: "alice", language: "en-IN" },
    "Thank you. Your complaint has been successfully recorded."
  );

  res.type("text/xml");
  res.send(twiml.toString());
});

export default router;