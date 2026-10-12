import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { Document } from "../models/document.models.js";
import { ProjectUserSession } from "../models/publicUserSession.models.js";

export const verifyProjectUser = asyncHandler(async (req, res, next) => {
    const token =req.cookies?.accessToken ||req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new apiErrors(401, "Access token is required");
    }

    let decoded;
    try {
        decoded = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        throw new apiErrors(401, "Invalid or expired access token");
    }

    const { _id, projectId, collectionId } = decoded;

    if (!_id || !projectId || !collectionId) {
        throw new apiErrors(401, "Invalid project-user token");
    }

    const documentUser = await Document.findOne({
        _id,
        collectionId
    });

    if (!documentUser) {
        throw new apiErrors(401, "Project user not found");
    }

    // Ensure this user has an active session for this project.
    const session = await ProjectUserSession.findOne({
        documentUserId: documentUser._id,
        projectId,
        collectionId,
        isRevoked: false,
        expiresAt: { $gt: new Date() }
    });

    if (!session) {
        throw new apiErrors(401, "Session expired or revoked");
    }

    req.projectUser = documentUser;
    req.projectUserSession = session;
    req.projectId = projectId;
    req.collectionId = collectionId;

    next();
});

