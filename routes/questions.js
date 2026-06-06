import express from "express";
import query from "../db/query.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/",authMiddleware,async (req, res) => {
    const {quiz_id} = req.query
    if (quiz_id){

        const result = await query(`
            SELECT *
            FROM questions
            WHERE quiz_id = ?
            `,
            [req.params.quizId]
        );
        
        for (const q of result.rows){
            
            const answers = await query(`
                SELECT id, option_text,is_correct
                FROM question_answers
                Where question_id =?
                `,
                [q.id]
            );
            
            result.answers = answers.rows;
        }

        res.json(result.rows);
    }
});

router.post("/", authMiddleware, async (req, res) => {

    const {
        quiz_id,
        question,
        type,
        options,
        correct_answer
    } = req.body;

    const result = await query(`
            INSERT INTO questions(
                quiz_id,
                question,
                type
            )
            VALUES(?,?,?)
            RETURNING id
        `,
        [
            Number(quiz_id),
            question,
            type
        ]
    );
        await query(`
            INSERT INTO question_answers(
                question_id,
                option_text,
                is_correct
            )
            VALUES(?,?,?)
            RETURNING id
        `,
        [
            result.rows[0].id,
            options,
            correct_answer
        ]
    );

    res.json({
        success: true
    });
});

// router.delete("/:id",authMiddleware,async (req, res) => {
//         await query(`
//                 DELETE FROM questions
//                 WHERE id = ?
//             `,
//              [req.params.id]
//         );

//         res.json({
//             success: true
//         });
//     }
// );

export default router;