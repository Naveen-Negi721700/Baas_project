import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { aiLimiter } from "../middlewares/ratelimiter.middlewares.js";
import { askAI } from "../controllers/Ai.controllers.js";

const router = Router();

// only signed-in users can use the AI, and each user gets 20 messages per hour
// (aiLimiter goes after verifyJWT, because it counts messages per user)
router.route("/askAI").post(verifyJWT, aiLimiter, askAI);

export default router;