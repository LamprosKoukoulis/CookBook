import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import query from "../db/query.js";

const router = express.Router();

router.get("/hall-of-fame", authMiddleware, async (req, res) => {
  const result = await query(`
    SELECT u.full_name, SUM(s.time_spent_seconds) as total_time
    FROM user_sessions s
    JOIN users u ON u.id = s.user_id
    GROUP BY s.user_id
    ORDER BY total_time DESC
    LIMIT 10
  `);

  res.json(result.rows);
});

export default router;