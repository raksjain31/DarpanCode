import expres from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { executeCode } from "../controllers/executeCode.controller.js";


const executionRoute = expres.Router();

executionRoute.post("/",authMiddleware,executeCode);


export default executionRoute;