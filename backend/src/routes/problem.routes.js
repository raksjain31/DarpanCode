import express from "express";
import { authMiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblembyId, UpdateProblem } from "../controllers/problem.controllers.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authMiddleware, checkAdmin, createProblem);

problemRoutes.get("/get-all-problems", authMiddleware,  getAllProblems);

problemRoutes.get("/get-problem/:id", authMiddleware, getProblembyId);

problemRoutes.put("/update-problem/:id", authMiddleware, checkAdmin, UpdateProblem);

problemRoutes.delete("/delete-problem/:id", authMiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems",authMiddleware, getAllProblemsSolvedByUser);



export default problemRoutes;