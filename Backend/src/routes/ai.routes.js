import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { askAI } from "../controllers/ai.controllers.js";

const router = Router();

// only signed-in users can use the AI
router.route("/askAI").post(verifyJWT, askAI);

export default router;