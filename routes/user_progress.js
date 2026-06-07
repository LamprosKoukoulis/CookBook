import express from "express";
import query from "../db/query.js";
import { adminMiddleware, authMiddleware } from "../middleware/auth.js";

const router = express.Router();


router.get("/", authMiddleware, async (req, res) => {
    const {
        user_id,
        module_id
    } = req.query;

    let result;
    if(user_id && module_id){
        result = await query(`
            SELECT *
            FROM user_progress
            WHERE user_id =? AND module_id=?
            `,[
            Number(user_id),
            Number(module_id)
        ]);
    }else if(user_id){
        result = await query(`
            SELECT *
            FROM user_progress
            WHERE user_id =?
            `,[Number(user_id)]);
    }else{
        result = await query(`
            SELECT *
            FROM user_progress`);
    }
    res.json(result.rows);

});

router.post("/", authMiddleware, async (req, res) => {
    const {
        module_id,
        completion_percent
    } = req.body;

    // We create or update if user_id,module_id exists in user_progress 
    await query(`
        INSERT INTO user_progress(
        user_id,
        module_id, 
        last_accessed)
        VALUES(?,?,?)
        
        ON CONFLICT(user_id,module_id)
        DO UPPDATE SET
        completion_percent - excluded.completion_percent,
        last_accessed = CURRENT_TIMESTAMP`,[
    req.user.id,
    Number(module_id),
    completion_percent,
    ]);

    res.json({
        success:true
    });
});

export default router;