import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import query from "../db/query.js";

const router = express.Router();

router.post("/start", authMiddleware, async (req, res) => {
  const { module_id } = req.body;

  await query({
    sql: `
      INSERT INTO user_sessions 
      (user_id, module_id, started_at)
      VALUES (?, ?, datetime('now'))
    `,
    args: [req.user.id, module_id],
  });

  res.json({ started: true });
});

router.post("/end", authMiddleware, async (req, res) => {
  const { session_id, seconds } = req.body;

  await query({
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