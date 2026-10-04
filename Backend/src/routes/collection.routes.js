import { Router } from "express";
import { createCollection, getCollections, getCollection, updateCollection, deleteCollection  } from "../controllers/collection.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const routes=Router();

routes.route("/createCollection/:projectId").post(verifyJWT, createCollection);
routes.route("/getCollections/:projectId").get(verifyJWT, getCollections);
routes.route("/getCollection/:projectId/:collectionId").get(verifyJWT, getCollection);
routes.route("/updateCollection/:projectId/:collectionId").patch(verifyJWT, updateCollection);
routes.route("/deleteCollection/:projectId/:collectionId").delete(verifyJWT, deleteCollection);
export default routes