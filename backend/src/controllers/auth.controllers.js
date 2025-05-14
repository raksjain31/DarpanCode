import bcrypt from "bcryptjs";
import { db } from "../libs/db.js";
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) =>{
    const {email,password,name } = req.body;
    
    try {
        const existinguser = await db.user.findUnique({
            where:{
                email
            }
        })

        if(existinguser)
        {
            return res.status(400).json({
               
                error:"User already exists"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password,10);

        const newUser = await db.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
                role: UserRole.USER
            }
        })
        const token = jwt.sign(
            {id:newUser.id}, 
            process.env.JWT_SECRET,
            {expiresIn:"7d"

            })

            res.cookie( "jwt",token,{
                httpOnly:true,
                secure:process.env.NODE_ENV !== "development",
                sameSite:"strict",
                maxAge:1000 * 60 * 60 * 24 * 7 //7ays
            })
        
            return res.status(201).json({
                sucess:true,
            message:"User created Successfully",
            
            user:{
                id:newUser.id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role,
                image:newUser.image
            }
        })

       
         
    } catch (error) {
        console.error("Error Creating user:", error);
    return res.status(500).json({
        error:"Failed to create user"
        })
        
    }
}

export const login = async (req, res) =>{
    const {email,password} = req.body;

    try {
        
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        if(!user)
        {
            return res.status(404).json({
                error:"User not found"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password);

        if(!isMatch)
        {
            return res.status(401).json({
                error:"Invalid credentials"
            })
        }

        const token = jwt.sign(
            {id:user.id}, 
            process.env.JWT_SECRET,
            {expiresIn:"7d"
            })

            res.cookie( "jwt",token,{
                
                httpOnly:true,
                secure:process.env.NODE_ENV !== "development",
                sameSite:"strict",
                maxAge:1000 * 60 * 60 * 24 * 7 //7ays
            })
        
            return res.status(200).json({
                sucess:true,
            message:"User logged in Successfully",
            
                user:{
                    id:user.id,
                    name:user.name,
                    email:user.email,
                    role:user.role,
                    image:user.image
                }
            })
    } catch (error) {
        
        console.error("Error Login User:", error);
        return res.status(500).json({
            error:"Login Failed"
            })
            
    }

}

export const logout = async (req, res) =>{
try {
    
    res.clearCookie("jwt",{
        httpOnly:true,
        secure:process.env.NODE_ENV !== "development",
        sameSite:"strict",
        
    });
    return res.status(200).json({
        sucess:true,
        message:"User logged out Successfully"
    })

    } catch (error) {
        console.error("Error Login User:", error);
            return res.status(500).json({
                error:"Login Failed"
                })
}

}

export const check = async (req, res) => {
    try {
        res.status(200).json({
            sucess:true,
            message:"User Authenticated Successfully",
            user:req.user
        });

    } catch (error) {
        console.error("Error Check User:", error);
        res.status(500).json({
            error:"Error Checking User"
        })
    }
}