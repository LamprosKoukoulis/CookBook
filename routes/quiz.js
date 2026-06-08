import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";
import query from "../db/query.js";

const router = express.Router();

router.post("/",authMiddleware,async(req,res) =>{
  const { module_id,title,course_id } = req.body;
  
  await query(`
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
  ]);

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
  const returns = await result.rows;
  res.json(result.rows);
});

router.post("/submit", authMiddleware, async (req, res) => {
  let score = 0;

  const userId = req.user.id;
  const { quiz_id, answers } = req.body;

  for (const a of answers) {

    const q = await query(`
      SELECT type
      FROM questions
      WHERE id = ?
    `, [a.question_id]);

    const question = q.rows[0];

    if (!question) continue;
    let isCorrect =false;
    // MULTIPLE CHOICE
    if (question.type === "multiple_choice") {

      const correct = await query(`
        SELECT id
        FROM question_answers
        WHERE question_id = ? AND is_correct = 1
      `, [a.question_id]);
      
      isCorrect = (correct.rows[0]?.id == a.answer);
    }

    // TRUE / FALSE
    else if (question.type === "true_false") {

      const correct = await query(`
        SELECT is_correct
        FROM question_answers
        WHERE question_id = ?
      `, [a.question_id]);
      
      isCorrect = (Number(correct.rows[0]?.is_correct) === Number(a.answer));
    }

    if (isCorrect) {
      score++;
    }

    // SAVE USER ANSWER (always)
    await query(`
      INSERT INTO user_answers (
        user_id,
        question_id,
        answer,
        is_correct
      ) VALUES (?, ?, ?, ?)
    `, [
      userId,
      a.question_id,
      a.answer,
      isCorrect? 1:0 // optional: calculate again or reuse logic
    ]);
  }

  res.json({
    score,
    total: answers.length
  });
});

export default router;