import jwt from "jsonwebtoken";
import { db } from "../libs/db.js";

export const authMiddleware = async (req, res,next) =>{

    try {

        const token = req.cookies.jwt;

        if(!token)
        {
            return res.status(401).json({
                error:"Unauthorized - No token Provided"
            })
        }

        let decoded;
        try {
            
            decoded = jwt.verify(token, process.env.jwt_secret);

        } catch (error) {
                return res.status(401).json({
                    message:"Unathorized - Invalid Token"
                })

            
        }

        const user = await db.user.findUnique({
            where:{
                id:decoded.id
            },
            select: {
                id: true,
                image: true,
                name: true,
                email: true,
                role:true
            }
        })


        if(!user)
        {
            return res.status(404).json({
                message : "user not found"
            });
        }

        req.user = user;
        next();
    } catch (error) {
        
        console.error("Error in Auth Middleware:", error);
        return res.status(500).json({
            error:"Internal Server Error"
        })
    }
}