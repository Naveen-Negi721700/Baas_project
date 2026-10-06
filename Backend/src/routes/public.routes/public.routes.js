import { Router } from "express";
import { verifyApiKey } from "../../middlewares/apiKey.middlewares.js";

const routes = Router();

routes.route("/register").post(verifyApiKey, registerUser);

export default routes;