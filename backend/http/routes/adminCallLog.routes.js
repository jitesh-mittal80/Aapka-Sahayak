import express from "express";
import { getCallLogs } from "../controllers/adminCallLog.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/call-logs", adminAuth, getCallLogs);

export default router;
