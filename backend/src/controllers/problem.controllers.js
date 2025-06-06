import { response } from "express";
import { db } from "../libs/db.js";
import { getJudge0LangaugeId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const createProblem = async (req, res) => {
    //going to get all the data from the request body
    const {title,
         description,
          difficulty, 
          tags, 
          examples, 
        constraints, 
        testcases,
         codeSnippets,
          referenceSolutions,
        } = req.body;
    
    //going to check user role once again
        if (req.user.role !== "ADMIN")
        {
            return res.status(403).json({
                error : "You are not allowed to create a problem"
            })
        }

    //loop through each reference solution for different  languages
    
    try {
        for( const [language , solutionCode] of Object.entries(referenceSolutions)){

            const languageId = getJudge0LangaugeId(language);

            if(!languageId)
            {
                return res.status(400).json({
                    error : `Language ${language} not supported`
                })
            }

            const submissions = testcases.map(({input,output}) => ({
                 
                    source_code : solutionCode,
                    language_id : languageId,
                    stdin : input,
                    expected_output : output,

                
                
            }))

            const submissionResults = await submitBatch(submissions);
                console.log("Submission sucess-----");
            const tokens = submissionResults.map((res)=>res. token);
                console.log("Submission Tokan-----",tokens);
            const results = await pollBatchResults(tokens);

            for(let i= 0 ; i < results.length ; i++)
            {
                
                const result = results[i];
                console.log("Result-----", result)
                    // console.log(`Testcase ${i+1} and Language ${ language} ---- result ${JSON.stringify(result.status.description)} ` );

                    if(result.status.id !== 3)
                    {
                        return res.status(400).json({
                            error : `Testcase ${i+1} failed for language ${language}`
                        })
                    }

            }
            ///Save the problem to the database;
                const newProblem = await db.problem.create({
                    data: {
                        title,
                        description,
                        difficulty,
                        tags,
                        examples,
                        constraints,
                        testcases,
                        codeSnippets,
                        referenceSolutions,
                        userId: req.user.id,
                    },
                    });
                return res.status(201).json({
                    sucess:true,
                    message:"Problem created successfully",
                    problem:newProblem
                }
                    
                   );
                
        }
    } catch (error) {
        console.log(error);
        return res. status(500).json({
            error : "Error While creating Problem",
        })
        
    }
    


};

export const getAllProblems = async (req, res) => { 

    try {
        
        const problems = await db.problem.findMany(
            {
                include:{
                    solvedBy:{
                        where:{
                            userId:req.user.id
                        }
                    }
                }
            }
        );

        if(!problems)
        {
            response.status(404).json({
                error:"No problems found"
            })
        }

        return res.status(200).json({
            sucess:true,
            message:"Problems fetched successfully",
            problems
        })

    } catch (error) {
         console.log(error);
        return res. status(500).json({
            error : "Error While Fetching Problems",
        })
    }
}

export const getProblemById  = async (req, res) => { 
    const {id} = req.params;
    try {
         const problem = await db.problem.findUnique({
        where :{
            id
        }

         })

        if(!problem){
            return res.status(400).json({
                error:"Problem not found."
            })

        }
            return res.status(200).json({
                        sucess:true,
                        message:"Problem Fetched successfully",
                        problem
                    })

        
    } catch (error) {
         console.log(error);
        return res. status(500).json({
            error : "Error While Fetching Problem by ID",
        })
    }
}

export const UpdateProblem = async (req, res) => { 
        const {id} = req.params;
     const {title,
                description,
                difficulty, 
                tags, 
                examples, 
                constraints, 
                testcases,
                codeSnippets,
                referenceSolutions,
        } = req.body;
      
            const problem = await db.problem.findUnique({
            where :{
                id
            }

            })

            if(!problem){
                return res.status(400).json({
                    error:"Problem not found."
                })

            }
    
    
    
       

         //going to check user role once again
        if (req.user.role !== "ADMIN")
        {
            return res.status(403).json({
                error : "You are not allowed to update a problem"
            })
        }


        try {
                
            for( const [language , solutionCode] of Object.entries(referenceSolutions)){

            const languageId = getJudge0LangaugeId(language);

            if(!languageId)
            {
                return res.status(400).json({
                    error : `Language ${language} not supported`
                })
            }

            const submissions = testcases.map(({input,output}) => ({
                 
                    source_code : solutionCode,
                    language_id : languageId,
                    stdin : input,
                    expected_output : output,

                
                
            }))

            const submissionResults = await submitBatch(submissions);
               // console.log("Submission sucess-----");
            const tokens = submissionResults.map((res)=>res. token);
                //console.log("Submission Tokan-----",tokens);
            const results = await pollBatchResults(tokens);

            for(let i= 0 ; i < results.length ; i++)
            {
                
                const result = results[i];
                console.log("Result-----", result)
                    // console.log(`Testcase ${i+1} and Language ${ language} ---- result ${JSON.stringify(result.status.description)} ` );

                    if(result.status.id !== 3)
                    {
                        return res.status(400).json({
                            error : `Testcase ${i+1} failed for language ${language}`
                        })
                    }

            }
            ///Save the problem to the database;
                const upProblem = await db.problem.update({
                    where :{
                        id : id
                    },
                    data: {
                        title,
                        description,
                        difficulty,
                        tags,
                        examples,
                        constraints,
                        testcases,
                        codeSnippets,
                        referenceSolutions,
                        userId: req.user.id,
                    },
                    });
                return res.status(201).json({
                    sucess:true,
                    message:"Problem Updated successfully",
                    problem:upProblem
                }
                    
                   );
                
            }

            } catch (error) {
                            console.log(error);
                    return res.status(500).json({
                        error: "Error while Updating problem"
                    })
            }




}

export const deleteProblem = async (req, res) => {
    const {id} = req.params;

    try {
        

        const problem = await db.problem.findUnique({where :{id}});

        if(!problem )
        {
            return res.status(404).json({
                error :"Problem not found"
            })
        }

        await db.problem.delete({where:{id}});
        return res.status(200).json({
            sucess: true,
            message:"Problem deleted sucessfully"

        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error: "Error while deleting problem"
        })
        
    }

 }

export const getAllProblemsSolvedByUser = async (req, res) => {
    try {
        
        const problems = await db.problem.findMany({
        where:{
            solvedBy:{
                some:{
                    userId:req.user.id
                }
            }

        },
        include:{
            solvedBy:{
                where:{
                    userId:req.user.id
                }
            }
        }


        })

        res.status(200).json({
            success:true,
            message:"Problems Fetched SuceessFully",
            problems
        })

    } catch (error) {

        console.error("Error Fetching Problems:",error);
        res.status(500).json({
            error:"Failed to fetch Problems"
        })
        

        
    }
 }