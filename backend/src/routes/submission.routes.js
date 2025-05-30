import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAlltheSubmissionsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();


submissionRoutes.get("/get-all-submissions", authMiddleware,  getAllSubmission);
submissionRoutes.get("/get-submission/:problemId",authMiddleware,getSubmissionsForProblem);
submissionRoutes.get("/get-submissions-count/:probleId",authMiddleware,getAlltheSubmissionsForProblem);
export default submissionRoutes;