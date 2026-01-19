import express from "express";
import {
  postSignup,
  adminLogin,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", postSignup);
router.post("/admin/login", adminLogin);

export default router;
