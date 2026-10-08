import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { ApiKey } from "../models/apiKey.models.js"
import { Project } from "../models/project.models.js";
import crypto from "crypto";



const createApiKey = asyncHandler(async (req, res) => {

    const { projectId } = req.params;
    const { name, type } = req.body;

    if (!projectId) {
        throw new apiErrors( 400, "Project ID is required");
    }
    if (!name || !name.trim()) {
        throw new apiErrors(400,"API key name is required" );
    }

    if (!type || !type.trim()) {
        throw new apiErrors(400,"API key type is required" );
    }

    if (!["public", "secret"].includes(type)) {
        throw new apiErrors(400,"Invalid type. Must be 'public' or 'secret'");
    }

    const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id
    });


    if (!project) {
        throw new apiErrors(404,"Project not found"  );
    }

    const apiKeyValue =`sk_${crypto.randomBytes(32).toString("hex")}`;

    const keyId =crypto.randomBytes(8).toString("hex");

    const apiKey = await ApiKey.create({
        userId: req.user._id,
        projectId: project._id,
        name: name.trim(),
        keyId,
        key: apiKeyValue,
        type,
        isActive: true
    });
    return res.status(201).json( new apiResponce( 201, { apiKeyValue, keyId }, "API Key created successfully"));
});

const getApiKeys = asyncHandler(async (req, res) => {
    const { projectId } = req.params;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    const project = await Project.findOne({_id: projectId, userId: req.user._id});

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const apiKeys = await ApiKey.find({ projectId: project._id, userId: req.user._id}).select("-key");

    if (!apiKeys || apiKeys.length === 0) {
        throw new apiErrors(404, "No API keys found for this project");
    }

    return res.status(200).json(new apiResponce(200,apiKeys,"API keys retrieved successfully") );
});

const getApiKey = asyncHandler(async (req, res) => {

    const { apiKeyId } = req.params;

    if (!apiKeyId) {
        throw new apiErrors(400, "API key ID is required");
    }

    // Find API key belonging to logged-in user
    const apiKey = await ApiKey.findOne({
        _id: apiKeyId,
        userId: req.user._id
    }).select("-key");

    if (!apiKey) {
        throw new apiErrors(404, "API key not found");
    }
    console.log('apiKey is ', apiKey);

    return res.status(200).json(new apiResponce(200, apiKey, "API key fetched successfully"));
})

const deleteApiKey = asyncHandler(async (req, res) => {
    const { apiKeyId } = req.params;

    if (!apiKeyId) {
        throw new apiErrors(400, "API key ID is required");
    }

    const apiKey = await ApiKey.findOneAndDelete({
        _id: apiKeyId,
        userId: req.user._id
    });

    if (!apiKey) {
        throw new apiErrors(404, "API key not found");
    }
    
    return res.status(200).json(new apiResponce(200, null, "API key deleted successfully"));
})
export { createApiKey, getApiKeys, getApiKey, deleteApiKey }