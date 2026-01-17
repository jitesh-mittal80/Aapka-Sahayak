import express from "express";
import twilio from "twilio";
import prisma from "../../prisma/client.js";
import { analyzeComplaint } from "../services/aiUnderstanding.service.js";
import { getOrCreateSession, updateSession } from "../services/session.service.js";

const router = express.Router();
const VoiceResponse = twilio.twiml.VoiceResponse;
router.post("/incoming-call", async(req, res) => {
  const callerPhone = req.body.From;
  // 🧠 Step 8.1 — ensure session exists
  if (callerPhone) {
    await getOrCreateSession(callerPhone);
  }
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
    const callerPhone = req.body.From;
    // 🧠 Step 8.1 — session fetch
    const session = await getOrCreateSession(callerPhone);

    // attach to request (mental model)
    const sessionContext = session.context || {};
    let sessionStep = session.currentStep || "START";

    const speechText = req.body.SpeechResult;

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
        citizenPhone: callerPhone,
      },
    });
    sessionContext.complaintId = complaint.id;
    sessionStep = "COMPLAINT_REGISTERED";

    await prisma.callLog.create({
      data: {
        callSid: req.body.CallSid,
        complaintId: complaint.id,
        direction: "INBOUND",
        speechResult: speechText,
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
      await prisma.callLog.update({
        where: { callSid: req.body.CallSid },
        data: { 
          aiDecision: finalCategory, 
          confidence: aiResult.confidence ?? null, 
        },
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
    await updateSession(callerPhone, {
      currentStep: sessionStep,
      context: sessionContext,
    });
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

router.post("/outbound", async (req, res) => {
  try {
    const twiml = new VoiceResponse();

    twiml.say(
      {
        voice: "alice",
        language: "en-IN",
      },
      "Hello. This is Aapka Sahayak calling from the Municipal Corporation. " +
        "Your complaint has been marked as resolved. " +
        "Please say YES if the issue is resolved, or NO if it is not."
    );

    twiml.gather({
      input: "speech",
      timeout: 5,
      action: `${process.env.NGROK_URL}/voice/verify?complaintId=${req.query.complaintId}`,
      method: "POST",
    });

    res.type("text/xml");
    res.send(twiml.toString());
  } catch (err) {
    console.error("Voice outbound error:", err);
    res.status(500).send("Voice error");
  }
  await prisma.callLog.create({
    data: {
      complaintId,
      callSid,
      direction: "OUTBOUND",
      aiDecision: "INITIATED",
    },
  });
});

router.post("/verify", async (req, res) => {
  console.log("========== VOICE VERIFY HIT ==========");
  console.log("QUERY:", req.query);
  console.log("BODY:", req.body);
  
  const twiml = new VoiceResponse();

  const callerPhone = req.body.From;
  const speech = (req.body.SpeechResult || "").toLowerCase();
  const complaintId = req.query.complaintId;

  if (callerPhone) {
    const session = await getOrCreateSession(callerPhone)

    await updateSession(callerPhone, {
      currentStep: "VERIFICATION_COMPLETED",
      context: {
        ...session.context,
        verificationResult: speech.includes("yes") ? "CONFIRMED" : "REJECTED",
      },
    });
  }

  if (!complaintId) {
    console.log("❌ NO COMPLAINT ID");
    twiml.say("Sorry, we could not identify your complaint.");
    res.type("text/xml");
    return res.send(twiml.toString());
  }

  console.log("✅ COMPLAINT ID:", complaintId);
  console.log("🎙 SPEECH:", speech);

  await prisma.callLog.update({
    where: { callSid: req.body.CallSid },
    data: {
      aiDecision: speech.includes("yes") ? "CONFIRMED" : "REJECTED",
      verifiedAt: new Date(),
    },
  });

  if (speech.includes("yes")) {
    console.log("➡️ UPDATING STATUS TO CLOSED");
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { status: "RESOLVED_CONFIRMED" },
    });
  }

  twiml.say("Thank you. Your complaint has been closed.");
  res.type("text/xml");
  res.send(twiml.toString());

  console.log("========== VERIFY END ==========");
});

export default router;