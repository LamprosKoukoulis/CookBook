import express from "express";
import query from "../db/query.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const {course_id} = req.query;
    let result;

    if(course_id){
        result = await query(`
                SELECT *
                FROM modules
                WHERE course_id = ?
                ORDER BY title
            `,[course_id]
        );
    }else{

        result = await query(`
            SELECT 
                modules.*,
                courses.title AS course_title
            FROM modules
            LEFT JOIN courses
            ON modules.course_id = courses.id
            ORDER BY modules.title
            `);
            
    }
    res.json(result.rows);
});

router.post("/", authMiddleware, async (req, res) => {

    const {
        course_id,
        title,
        content
    } = req.body;

    await query(`
            INSERT INTO modules(
                course_id,
                title,
                content
            )
            VALUES(?,?,?)
        `,[
            course_id,
            title,
            content
        ]
    );

    res.json({
        success: true
    });
});

export default router;