import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "../routes/auth.js";
import courseRoutes from "../routes/courses.js";
import quizRoutes from "../routes/quiz.js";
import moduleRoutes from "../routes/modules.js";
import questionRoutes from "../routes/questions.js";
import sessionRoutes from "../routes/sessions.js";
import statsRoutes from "../routes/stats.js";
import user_answers from "../routes/user_answers.js";
import user_progress from "../routes/user_progress.js";
import user_sessions from "../routes/user_sessions.js";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));

// fetch("http://localhost:3000/courses", {
//   credentials: "include"
// });

app.get("/", (req, res) => {
    res.redirect("/dashboard.html");
});
app.use("/auth", authRoutes);
app.use("/courses", courseRoutes);
app.use("/quiz", quizRoutes);
app.use("/modules", moduleRoutes);
app.use("/questions", questionRoutes);
app.use("/sessions", sessionRoutes);
app.use("/stats", statsRoutes);
app.use("/user_answers",user_answers);
app.use("/user_progress",user_progress);
app.use("/user_sessions",user_sessions);

export default app;