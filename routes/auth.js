import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import query from "../db/query.js"
import { authMiddleware,adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      password,
      full_name,
      semester
    } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters"
      });
    }

    const existing = await query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        error: "Email already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users(email,password_hash,full_name,semester)
      VALUES(?,?,?,?)
      `,
      [
        email,
        hash,
        full_name,
        semester || 1
      ]
    );

    res.status(201).json({
      message: "User created"
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server error"
    });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await query(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );

  const u = user.rows[0];
  if (!u) return res.status(401).json({ error: "Invalid email" });

  const valid = await bcrypt.compare(password, u.password_hash);
  if (!valid) return res.status(401).json({ error: "Invalid password" });

  const token = jwt.sign(
    { id: u.id, role: u.role,semester: u.semester },
    process.env.JWT_SECRET
  );

    res.cookie("token", token, {
    httpOnly: true,
    secure: false, // TODO: true (https)
    sameSite: "lax",
    maxAge: 360 * 24 * 60 * 60 * 1000, // 1 χρόνο
  });
  // console.log("LOGIN COOKIE SET");
  res.json({ token });
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

router.get(
  "/me",
  authMiddleware,
  async (req,res)=>{

    const user =
      await query(`
        SELECT
          id,
          email,
          full_name,
          semester,
          role
        FROM users
        WHERE id = ?
        `,
        [req.user.id]
      );
    
    res.json(user.rows[0]);
  }
);

router.get(
    "/admin/panel",
    authMiddleware,
    adminMiddleware,
    (req, res) => {
        res.redirect("/admin.html");
    }
);

export default router;