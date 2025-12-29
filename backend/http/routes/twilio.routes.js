import express from "express";

const router = express.Router();

router.post("/incoming-call", (req, res) => {
  res.set("Content-Type", "text/xml");

  res.send(`
    <Response>
      <Say voice="alice">
        Hello, this is Aapka Sahayak. Your call has reached our system.
      </Say>
    </Response>
  `);
});

export default router;
