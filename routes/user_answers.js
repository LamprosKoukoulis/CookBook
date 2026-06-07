import express from "express";
import query from "../db/query.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
    const {
        user_id,
        question_id
    } = req.query;

    let result;
    if(user_id){
        result = await query(`
            SELECT *
            FROM user_answers
            WHERE user_id =?
            `,[Number(user_id)]);
    }else if(question_id){
        result = await query(`
            SELECT *
            FROM user_answers
            WHERE question_id =?
            `,[Number(question_id)]);
    }else{
        result = await query(`
            SELECT *
            FROM user_answers`);
    }
    res.json(result.rows);

});

router.post("/", authMiddleware, async (req, res) => {
    const {
        question_id,
        answer,
        is_correct
    } = req.body;

    await query(`
        INSERT INTO user_answers(
            user_id, 
            question_id,
            answer,
            is_correct)
        VALUES(?,?,?,?)`,[
        req.user.id,
        Number(question_id),
        answer,
        Number(is_correct)
    ]);

    res.json({
        success:true
    });
});

export default router;