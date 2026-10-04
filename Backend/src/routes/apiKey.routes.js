import { Router } from "express";
import { createApiKey, getApiKeys, getApiKey, deleteApiKey} from "../controllers/apiKey.controllers.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes=Router();

routes.route("/createApiKey/:projectId").post(verifyJWT, createApiKey);
routes.route("/getApiKeys/:projectId").get(verifyJWT, getApiKeys);
routes.route("/getApiKey/:apiKeyId").get(verifyJWT, getApiKey);
routes.route("/deleteApiKey/:apiKeyId").delete(verifyJWT, deleteApiKey);


export default routes