import express from "express";
import query from "../db/query.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get(
    "/quiz/:quizId",
    authMiddleware,
    async (req, res) => {

        const result = await query({
            sql: `
                SELECT *
                FROM questions
                WHERE quiz_id = ?
            `,
            args: [req.params.quizId]
        });

        for (const q of result.rows){

            const answers = await query({
                sql:`
                SELECT id, option_text,is_correct
                FROM question_answers
                Where question_id =?
                `,
                args: [q.id]
            });

            result.answers = answers.rows;
        }

        res.json(result.rows);
    }
);

router.post("/", authMiddleware, async (req, res) => {

    const {
        quiz_id,
        question,
        type,
        correct_answer
    } = req.body;

    await query({
        sql: `
            INSERT INTO questions(
                quiz_id,
                question,
                type,
                correct_answer
            )
            VALUES(?,?,?,?,?)
        `,
        args: [
            quiz_id,
            question,
            type,
            correct_answer
        ]
    });

    res.json({
        success: true
    });
});

router.delete("/:id",authMiddleware,async (req, res) => {
        await query({
            sql: `
                DELETE FROM questions
                WHERE id = ?
            `,
            args: [req.params.id]
        });

        res.json({
            success: true
        });
    }
);

export default router;