import express from "express";
import { getAllCitizens } from "../controllers/adminCitizen.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

router.get("/citizens", adminAuth, getAllCitizens);

export default router;
