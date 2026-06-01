import express from "express";
import { db } from "../db/client.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.post("/start", authMiddleware, async (req, res) => {
  const { module_id } = req.body;

  await db.execute({
    sql: `
      INSERT INTO user_sessions 
      (id, user_id, module_id, started_at)
      VALUES (lower(hex(randomblob(16))), ?, ?, datetime('now'))
    `,
    args: [req.user.id, module_id],
  });

  res.json({ started: true });
});

router.post("/end", authMiddleware, async (req, res) => {
  const { session_id, seconds } = req.body;

  await db.execute({
    sql: `
      UPDATE user_sessions
      SET ended_at = datetime('now'),
          time_spent_seconds = ?
      WHERE id = ?
    `,
    args: [seconds, session_id],
  });

  res.json({ ended: true });
});

export default router;