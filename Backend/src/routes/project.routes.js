import { Router } from "express";
import { createProject, getProjects, getProject,updateProject, deleteProject } from "../controllers/project.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes=Router();

routes.route("/createProject").post(verifyJWT, createProject);
routes.route("/getProjects").get(verifyJWT, getProjects);
routes.route("/getProject/:projectId").get(verifyJWT, getProject);
routes.route("/updateProject/:projectId").patch(verifyJWT, updateProject);
routes.route("/deleteProject/:projectId").delete(verifyJWT, deleteProject);

export default routes