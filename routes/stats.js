import express from "express";
import { authMiddleware } from "../middleware/auth.js";
import query from "../db/query.js";

const router = express.Router();

router.get("/hall-of-fame", authMiddleware, async (req, res) => {
  const result = await query(`
    SELECT u.full_name, s.started_at, s.ended_at
    FROM user_sessions s
    JOIN users u ON u.id = s.user_id
  `);
  
  const usersMap = new Map();

  for (const r of result.rows) {

    const time = total_seconds(r.started_at, r.ended_at);

    if (!usersMap.has(r.id)) {
      usersMap.set(r.id, {
        full_name: r.full_name,
        total_time: 0
      });
    }

    usersMap.get(r.id).total_time += time;
  }

  const leaderboard = [...usersMap.values()]
    .sort((a, b) => b.total_time - a.total_time)
    .slice(0, 10);

  res.json(leaderboard);
});


//return count of correct/wrong answers, total time.
router.get("/me",authMiddleware,async(req,res)=>{
  const user_id = req.user.id;

  const answersR = await query(`
      SELECT is_correct
      FROM user_answers
      WHERE user_id = ?
    `,[user_id]);

    const sessionsR = await query(`
      SELECT started_at, ended_at
      FROM user_sessions
      WHERE user_id = ?
      `,[user_id]
    );
    
    answers = answersR.rows;
    sessions = sessionsR.rows;

    const correct_answers = answers.filter(a => a.is_correct ===1).length;
    const wrong_answers = answers.length - correct_answers;

    let total = 0;
    for(const s of sessions){
      if(s.started_at || s.ended_at){
        total+= total_seconds(s.started_at,s.ended_at);
      }
    }

    res.json({
      correct_answers,
      wrong_answers,
      total_hours: total/3600
    });

});

function total_seconds(started_at,ended_at){
        const start = new Date(started_at);
        const end = new Date(ended_at);

        return (end - start)/1000;
}

router.get("/module", authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { moduleId } = req.query;

    // completion %
    const progress = await query(`
        SELECT completion_percent
        FROM user_progress
        WHERE user_id = ? AND module_id = ?
    `, [userId, moduleId]);

    // last score (from user_answers grouped per quiz/module)
    const lastScore = await query(`
        SELECT COUNT(*) as correct
        FROM user_answers ua
        JOIN questions q ON q.id = ua.question_id
        WHERE ua.user_id = ?
        AND q.quiz_id IN (
            SELECT id FROM quizzes WHERE module_id = ?
        )
        AND ua.is_correct = 1
    `, [userId, moduleId]);

    res.json({
        completion_percent: progress.rows[0]?.completion_percent || 0,
        last_score: lastScore.rows[0]?.correct || 0
    });
});
export default router;