import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies?.token;
  // console.log("COOKIE:", req.cookies);
  // console.log("HEADERS:", req.headers.cookie);
  if (!token) return res.status(401).json({ error: "No token" });

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
}

export function adminMiddleware(req, res, next) {
    if (req.user.role !== "admin") {
        return res.status(403).json({
            error: "Admins only"
        });
    }
    next();
}