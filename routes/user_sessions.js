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
    if(user_id){
        result = await query(`
            SELECT *
            FROM user_sessions
            WHERE user_id =?
            `,[Number(user_id)]);
    }else if(question_id){
        result = await query(`
            SELECT *
            FROM user_sessions
            WHERE module_id =?
            `,[Number(module_id)]);
    }else{
        result = await query(`
            SELECT *
            FROM user_sessions`);
    }
    res.json(result.rows);

});

//Start session
router.post("/", authMiddleware, async (req, res) => {
    const { module_id } = req.body;

    if(module_id){

        const result = await query(`
            INSERT INTO user_sessions(
                user_id, 
                module_id,
                started_at)
                VALUES(?,?,CURENT_TIMESTAMP)
                RETURNING id`,[
                    req.user.id,
    Number(module_id)
]);

res.json({
    session_id: result.rows[0].id
});
}else{
    console.error("[user_sessions] module_id is not specified!");
    res.json({
        success:false
    })
}
});

// END session
router.put("/",authMiddleware,async (req,res) =>{
    const {session_id} = req.body;
    if(session_id){
        await query(`
            UPDATE user_sessions
            SET 
            ended_at = CURRENT_TIMESTAMP
            WHERE id = ?
            `,[session_id]);
            
            res.json({
                success:true
            })
        }else{
        res.json({
            success:false
        });
    }
});


export default router;