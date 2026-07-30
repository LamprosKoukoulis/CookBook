import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import query from "../db/query.js"
import { authMiddleware,adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/pending-teachers",authMiddleware,adminMiddleware,async(req,res)=>{
    const result = await query(`SELECT id,
        full_name, 
        email
        FROM users
        WHERE role = "pending_teacher"
    `);

    res.json(result.rows);
});

router.put("/approve-teacher",authMiddleware,adminMiddleware,async(req,res)=>{
    const {user_id}= req.body;
    
    await query(`UPDATE users
        SET role = "teacher"
        WHERE id = ?
        `,[user_id]
    );

    res.json({success:true});
});

export default router;