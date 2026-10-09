import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apiKey.middlewares.js";
import {registerUser, loginUser} from  "../../controllers/public.controllers/publicAuth.controllers.js"

const routes = Router();

routes.route("/register/:collectionId").post(verifyApiKey, registerUser);
routes.route("/loginUser/:collectionId").post(verifyApiKey, loginUser);

export default routes;