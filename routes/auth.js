import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { db } from "../db/client.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password, full_name, semester } = req.body;

  const hash = await bcrypt.hash(password, 10);

  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, full_name, semester)
          VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)`,
    args: [email, hash, full_name, semester],
  });

  res.json({ message: "User created" });
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.execute({
    sql: "SELECT * FROM users WHERE email = ?",
    args: [email],
  });

  const u = user.rows[0];
  if (!u) return res.status(401).json({ error: "Invalid email" });

  const valid = await bcrypt.compare(password, u.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: u.id, semester: u.semester },
    process.env.JWT_SECRET
  );

  res.json({ token });
});

export default router;