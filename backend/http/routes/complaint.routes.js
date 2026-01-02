import express from "express";
import { aiVerifyComplaint } from "../controllers/complaint.controller.js";
import {
  createComplaint,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";
import { markComplaintResolved } from "../controllers/complaint.controller.js";

const router = express.Router();

// Existing
router.post("/", createComplaint);

// New
router.patch("/:id/status", updateComplaintStatus);
router.post("/:id/ai-verify", aiVerifyComplaint);

router.post("/:id/mark-resolved", markComplaintResolved);

export default router;
