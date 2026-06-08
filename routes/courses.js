import express from "express";
import query from "../db/query.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
  const { course_id,semester } = req.query;
  let result;
  if(course_id){
    result = await query(`
      SELECT * FROM courses WHERE course_id = ?
      `,[course_id]);
    }else{
      result = await query("SELECT * FROM courses");
  }
  res.json(result.rows);
});

router.get("/semester",authMiddleware, async (req,res) =>{
    const semester = req.user.semester; 
    
    const result = await query(`
            SELECT * FROM courses WHERE semester <= ?
            `,[Number(semester)]);

    res.json(result.rows);
});

router.post("/", authMiddleware, async (req, res) => {

    const {
            title,
            description,
            semester
    } = req.body;

    await query(
        `
            INSERT INTO courses(
                title,
                description,
                semester
            )
            VALUES(?,?,?)
        `,[
            title,
            description,
            Number(semester)
        ]
    );

    res.json({
        success: true
    });
});

export default router;