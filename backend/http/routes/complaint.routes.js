import express from "express";
import {
  createComplaint,
  updateComplaintStatus,
} from "../controllers/complaint.controller.js";

const router = express.Router();

// Existing
router.post("/", createComplaint);

// New
router.patch("/:id/status", updateComplaintStatus);

export default router;
