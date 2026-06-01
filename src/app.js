import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../routes/auth.js";
import courseRoutes from "../routes/courses.js";
import quizRoutes from "../routes/quiz.js";
import sessionRoutes from "../routes/sessions.js";
import statsRoutes from "../routes/stats.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/quiz", quizRoutes);
app.use("/sessions", sessionRoutes);
app.use("/stats", statsRoutes);

export default app;