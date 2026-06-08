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
            `,[quiz_id]
        );
        
        for (const q of result.rows){
            
            const answers = await query(`
                SELECT id, option_text,is_correct
                FROM question_answers
                Where question_id =?
                `,[q.id]
            );
            
            q.answers = answers.rows;
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
        correct_answer,
        difficulty
    } = req.body;
    
    const result = await query(`
            INSERT INTO questions(
                quiz_id,
                question,
                type,
                difficulty
            )
            VALUES(?,?,?,?)
            RETURNING id
        `,[
            Number(quiz_id),
            question,
            type,
            Number(difficulty)
        ]
    );
    if(type ==="true_false"){
                await query(`
            INSERT INTO question_answers(
                question_id,
                is_correct
                )
                VALUES(?,?)
                RETURNING id
            `,[
                Number(result.rows[0].id),
                Number(correct_answer)
        ]);
        return;
    }

    for(let i =0; i< options.length;i++){
        await query(`
            INSERT INTO question_answers(
                question_id,
                option_text,
                is_correct
                )
                VALUES(?,?,?)
                RETURNING id
            `,[
                Number(result.rows[0].id),
                options[i],
                i == correct_answer ? 1 : 0
        ]);
    }
            
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