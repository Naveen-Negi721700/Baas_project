import { Router } from "express";
import { registerUser, loginUser } from "../controllers/auth.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";

const routes=Router();

routes.route("/register").post(upload.fields([{ name: "avatar", maxCount: 1 },{ name: "coverImage", maxCount: 1 }]),registerUser);

routes.route("/login").post(loginUser);

export default routes