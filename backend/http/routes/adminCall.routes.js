import express from "express";
import { triggerVerificationCall } from "../controllers/adminCall.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.post(
  "/complaints/:id/trigger-call",
  adminAuth,
  triggerVerificationCall
);

export default router;
