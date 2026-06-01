import express from "express";
import { db } from "../db/client.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/:moduleId", authMiddleware, async (req, res) => {
  const result = await db.execute({
    sql: `
      SELECT q.*
      FROM quizzes qz
      JOIN questions q ON q.quiz_id = qz.id
      WHERE qz.module_id = ?
    `,
    args: [req.params.moduleId],
  });

  res.json(result.rows);
});

router.post("/submit", authMiddleware, async (req, res) => {
  const { answers } = req.body; // [{question_id, answer}]

  let score = 0;

  for (const a of answers) {
    const q = await db.execute({
      sql: "SELECT correct_answer FROM questions WHERE id = ?",
      args: [a.question_id],
    });

    const correct = q.rows[0]?.correct_answer;

    const isCorrect = correct === a.answer;
    if (isCorrect) score++;

    await db.execute({
      sql: `
        INSERT INTO user_answers 
        (id, user_id, question_id, answer, is_correct)
        VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)
      `,
      args: [req.user.id, a.question_id, a.answer, isCorrect ? 1 : 0],
    });
  }

  res.json({ score });
});

export default router;