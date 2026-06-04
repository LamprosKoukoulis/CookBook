import express from "express";
import query from "../db/query.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const result = await query("SELECT * FROM courses");
  res.json(result.rows);
});

router.get("/:id/modules", authMiddleware, async (req, res) => {
  const result = await query({
    sql: "SELECT * FROM modules WHERE course_id = ?",
    args: [req.params.id],
  });

  res.json(result.rows);
});

export default router;