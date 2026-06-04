import express from "express";
import query from "../db/query.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {

    const result = await query(`
        SELECT
            modules.*,
            courses.title AS course_title
        FROM modules
        LEFT JOIN courses
        ON modules.course_id = courses.id
        ORDER BY modules.title
    `);

    res.json(result.rows);
});

router.get("/course/:courseId",
    authMiddleware,
    async (req, res) => {

        const result = await query({
            sql: `
                SELECT *
                FROM modules
                WHERE course_id = ?
                ORDER BY title
            `,
            args: [req.params.courseId]
        });

        res.json(result.rows);
    }
);

router.post("/", authMiddleware, async (req, res) => {

    const {
        course_id,
        title,
        content,
        difficulty
    } = req.body;

    await query({
        sql: `
            INSERT INTO modules(
                course_id,
                title,
                content,
                difficulty
            )
            VALUES(?,?,?,?,?)
        `,
        args: [
            course_id,
            title,
            content,
            difficulty
        ]
    });

    res.json({
        success: true
    });
});

export default router;