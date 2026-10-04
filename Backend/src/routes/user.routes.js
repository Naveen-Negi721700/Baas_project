import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshaccessToken } from "../controllers/auth.controllers.js";
import { createProject, getProjects, getProject,updateProject, deleteProject } from "../controllers/project.controllers.js";
import { createApiKey, getApiKeys, getApiKey, deleteApiKey} from "../controllers/apiKey.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes=Router();

routes.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 },{ name: "coverImage", maxCount: 1 }]),registerUser);
routes.route("/logIn").post(loginUser);
routes.route("/logOut").post(verifyJWT, logoutUser);
routes.route("/currentUser").get(verifyJWT, getCurrentUser);
routes.route("/refreshAccessToken").post(refreshaccessToken);


routes.route("/createProject").post(verifyJWT, createProject);
routes.route("/getProjects").get(verifyJWT, getProjects);
routes.route("/getProject/:projectId").get(verifyJWT, getProject);
routes.route("/updateProject/:projectId").patch(verifyJWT, updateProject);
routes.route("/deleteProject/:projectId").delete(verifyJWT, deleteProject);


routes.route("/createApiKey/:projectId").post(verifyJWT, createApiKey);
routes.route("/getApiKeys/:projectId").get(verifyJWT, getApiKeys);
routes.route("/getApiKey/:apiKeyId").get(verifyJWT, getApiKey);
routes.route("/deleteApiKey/:apiKeyId").delete(verifyJWT, deleteApiKey);

export default routes