import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";
import query from "../db/query.js";

const router = express.Router();

router.post("/",authMiddleware,async(req,res) =>{
    const { module_id,title,course_id } = req.body;
    
    await query(
        `
            INSERT INTO quizzes(
              course_id,  
              module_id,
              title
            )
            VALUES(?,?,?)
        `,[
          Number(course_id),
          Number(module_id),
            title,
        ]
    );

    res.json({
        success: true
    });
});

router.get("/", authMiddleware, async (req, res) => {
  const { module_id } = req.query;
  let result;
  if (module_id){
      result = await query(`
      SELECT *
      FROM quizzes
      WHERE module_id = ?
    `,[module_id]
  );

  }else{
    result = await query("SELECT * FROM quizzes");
  }
  res.json(result.rows);
});

export default router;