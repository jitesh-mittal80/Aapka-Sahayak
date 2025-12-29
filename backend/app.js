import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";

import env from "./env.js";

// ROUTES
import authRouters from "./http/routes/auth.routes.js";
import complaintRoutes from "./http/routes/complaint.routes.js";

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

//  Routes 
app.use("/api/auth", authRouters);
app.use("/api/complaints", complaintRoutes);

// Server 
const server = http.createServer(app);

server.listen(env.PORT, () => {
  console.log(`🚀 Server running at http://localhost:${env.PORT}`);
});
