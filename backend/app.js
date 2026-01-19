import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import twilioRoutes from "./http/routes/twilio.routes.js";
import voiceRoutes from "./http/routes/voice.routes.js";

import env from "./env.js";

// ROUTES
import authRouters from "./http/routes/auth.routes.js";
import complaintRoutes from "./http/routes/complaint.routes.js";
import adminComplaintRoutes from "./http/routes/adminComplaint.routes.js";
import adminCallRoutes from "./http/routes/adminCall.routes.js";
import adminCitizenRoutes from "./http/routes/adminCitizen.routes.js";
import adminCallLogRoutes from "./http/routes/adminCallLog.routes.js";

dotenv.config();

const app = express();

//Middleware 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use("/api/admin", (req, res, next) => {
  res.setHeader("Cache-Control", "no-store");
  next();
});

//  Routes 
app.use("/twilio", twilioRoutes);
app.use("/voice", voiceRoutes);
app.use("/api/auth", authRouters);
app.use("/api/complaints", complaintRoutes);
app.use("/api/admin", adminComplaintRoutes);
app.use("/api/admin", adminCallRoutes);
app.use("/api/admin", adminCitizenRoutes);
app.use("/api/admin", adminCallLogRoutes);
app.use("/api/auth", authRouters);

// Server 
const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
});
