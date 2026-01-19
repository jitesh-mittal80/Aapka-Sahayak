// import express from "express";
// import {
//   getAllComplaints,
//   updateComplaintStatus,
// } from "../controllers/adminComplaint.controller.js";
// import { adminAuth } from "../middleware/adminAuth.js";

// const router = express.Router();

// // Admin-only routes
// router.get("/", adminAuth, getAllComplaints);
// router.patch(
//   "/:id/status",
//   adminAuth,
//   updateComplaintStatus
// );

// export default router;

// http/routes/adminComplaint.routes.js
import express from "express";
import { getAllComplaints, updateComplaintStatus } from "../controllers/adminComplaint.controller.js";
import { adminAuth } from "../middleware/adminAuth.js";

const router = express.Router();

// 🔥 ADD PREFIX HERE
router.get("/complaints", adminAuth, getAllComplaints);
router.patch("/complaints/:id/status", adminAuth, updateComplaintStatus);

export default router;
