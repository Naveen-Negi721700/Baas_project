import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apiKey.middlewares.js";
import { apiKeyLimiter } from "../../middlewares/ratelimiter.middlewares.js";
import {registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken} from  "../../controllers/public.controllers/publicAuth.controllers.js"
import { verifyProjectUser } from "../../middlewares/publicAuth.middlewares.js";
const routes = Router();

// verifyApiKey checks the key first, then apiKeyLimiter counts the requests of that valid key
routes.route("/register/:collectionId").post(verifyApiKey, apiKeyLimiter, registerUser);
routes.route("/loginUser/:collectionId").post(verifyApiKey, apiKeyLimiter, loginUser);
routes.route("/logoutUser").post(verifyApiKey, apiKeyLimiter, verifyProjectUser, logoutUser);
routes.route("/getCurrentUser").get(verifyApiKey, apiKeyLimiter, verifyProjectUser, getCurrentUser);
routes.route("/refreshAccessToken").post(verifyApiKey, apiKeyLimiter, refreshAccessToken);

export default routes;