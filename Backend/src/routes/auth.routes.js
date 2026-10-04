import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshaccessToken } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes=Router();

routes.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 },{ name: "coverImage", maxCount: 1 }]),registerUser);
routes.route("/logIn").post(loginUser);
routes.route("/logOut").post(verifyJWT, logoutUser);
routes.route("/currentUser").get(verifyJWT, getCurrentUser);
routes.route("/refreshAccessToken").post(refreshaccessToken);

export default routes;