import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apiKey.middlewares.js";
import {registerUser} from  "../../controllers/public.controllers/publicAuth.controllers.js"

const routes = Router();

routes.route("/register/:collectionId").post(verifyApiKey, registerUser);

export default routes;