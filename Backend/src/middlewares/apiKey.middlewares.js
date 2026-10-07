import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { ApiKey } from "../models/apiKey.models.js";
import bcrypt from "bcryptjs";

export const verifyApiKey = asyncHandler(async (req, res, next) => {

    const keyId = req.header("x-api-key-id");
    const apiKeyValue = req.header("x-api-key");

    if (!keyId || !apiKeyValue) {
        throw new apiErrors(
            401,
            "API key credentials are required"
        );
    }

    const apiKey = await ApiKey.findOne({
        keyId,
        isActive: true
    });

    if (!apiKey) {
        throw new apiErrors(
            401,
            "Invalid API key"
        );
    }    


    const isValid = await bcrypt.compare(
        apiKeyValue,
        apiKey.key
    );

    if (!isValid) {
        throw new apiErrors(
            401,
            "Invalid API key"
        );
    }

    req.apiKey = apiKey;

    next();
});