import { db } from "../libs/db.js";

export const getAllSubmission = async(req,res)=>{
    try {

        const userId = req.user.id;
        const submission = await db.submission.findMany({
            where:{
                userId:userId
            }
        })
         res.status(200).json({
            success: true,
            message: "Submissions Fetched Sucessfully ",
            submissions
        })
        
        
    } catch (error) {
        console.error("Error Fetching Submissions:", error);
        res.status(500).json({
            error: "Failed to Fetch Submissions"
        });

       
    }

}

export const getSubmissionsForProblem = async(req,res)=>{

    try {
        
        const userId = req.user.id;
        const problemId = req.params.problemID;
        const submissions = awaitdb.submission.findMany({
            where:{
                userId:userId,
                problemId: problemId
            }
        })
        res.status(200).json({
            sucess: true,
            message:"Submissions Fetched Successfully",
            submissions
        })

    } catch (error) {
        console.error("Fetch Submissions Error:",error);
        res.status(500).json({
            erro: "Failed to Fetch Submissions for this Problem"
        })
        
    }

}

export const getAlltheSubmissionsForProblem = async(req,res)=>{

    try {
        const problemId = req.param.problemId;
        const submission = await db.submission.count({

            where:{
                problemId:problemId
            }
        })

        res.status(200).json({
            sucess: true,
            message:"All Submissions Fetched Successfully",
            count: submission
        })


    } catch (error) {

         console.error("Fetch Submissions Error:",error);
        res.status(500).json({
            erro: "Failed to Fetch All Submissions for this Problem"
        })
        
    }
}