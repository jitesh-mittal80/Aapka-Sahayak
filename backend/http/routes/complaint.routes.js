import express from "express";
import { createComplaint } from "../controllers/complaint.controller.js";

const router = express.Router();

router.post("/", createComplaint);

export default router;
