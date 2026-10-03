import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import {ApiKey} from "../models/apiKey.models.js"


const createApiKey= asyncHandler(async(req,res)=>{
    const { projectId, name, type } = req.body;
    if ([projectId, name, type].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fields are required")
    }
    
})