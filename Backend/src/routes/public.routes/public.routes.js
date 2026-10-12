import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apiKey.middlewares.js";
import {registerUser, loginUser, logoutUser, getCurrentUser, refreshAccessToken} from  "../../controllers/public.controllers/publicAuth.controllers.js"
import { verifyProjectUser } from "../../middlewares/publicAuth.middlewares.js";
const routes = Router();

routes.route("/register/:collectionId").post(verifyApiKey, registerUser);
routes.route("/loginUser/:collectionId").post(verifyApiKey, loginUser);
routes.route("/logoutUser").post(verifyApiKey,verifyProjectUser, logoutUser);
routes.route("/getCurrentUser").get(verifyApiKey,verifyProjectUser, getCurrentUser);
routes.route("/refreshAccessToken").post(verifyApiKey, refreshAccessToken);

export default routes;