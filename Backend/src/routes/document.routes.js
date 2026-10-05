import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import {createDocument, getDocuments, getDocument, updateCollection, deleteCollection} from  "../controllers/document.controllers.js";
const routes = Router();

routes.route("/createDocument/:projectId/:collectionId").post(verifyJWT, createDocument );
routes.route("/getDocuments/:projectId/:collectionId").get(verifyJWT, getDocuments );
routes.route("/getDocument/:projectId/:collectionId/:documentId").get(verifyJWT, getDocument );
routes.route("/updateCollection/:projectId/:collectionId").patch(verifyJWT, updateCollection );
routes.route("/deleteCollection/:projectId/:collectionId").delete(verifyJWT, deleteCollection );

export default routes;