import express from "express";
import {
  getAllComplaints,
  updateComplaintStatus,
} from "../controllers/adminComplaint.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// Admin-only
router.get("/complaints", adminAuth, getAllComplaints);
router.patch("/complaints/:id/status", adminAuth, updateComplaintStatus);

export default router;
