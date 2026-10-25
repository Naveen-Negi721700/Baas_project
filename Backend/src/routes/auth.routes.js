import { Router } from "express";
import { registerUser, loginUser, logoutUser, getCurrentUser, refreshaccessToken } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { loginLimiter, signupLimiter } from "../middlewares/ratelimiter.middlewares.js";

const routes=Router();

// the limiter goes first, so a blocked user does not even upload the avatar
routes.route("/register").post(signupLimiter, upload.fields([{ name: "avatar", maxCount: 1 },{ name: "coverImage", maxCount: 1 }]),registerUser);
routes.route("/logIn").post(loginLimiter, loginUser);
routes.route("/logOut").post(verifyJWT, logoutUser);
routes.route("/currentUser").get(verifyJWT, getCurrentUser);
routes.route("/refreshAccessToken").post(refreshaccessToken);

export default routes;