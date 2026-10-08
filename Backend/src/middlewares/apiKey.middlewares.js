import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { ApiKey } from "../models/apiKey.models.js";


export const verifyApiKey = asyncHandler(async (req, res, next) => {

    const keyId = req.header("x-api-key-id");
    const apiKeyValue = req.header("x-api-key");
    console.log("Key ID received:", keyId);

    if (apiKeyValue) {
        console.log("API Key received:",`${apiKeyValue.substring(0, 10)}...${apiKeyValue.slice(-6)}` );

    } else {
        console.log("API Key received: NOT FOUND" );
    }

    if (!keyId || !apiKeyValue) {
        throw new apiErrors( 401, "API key credentials are required" );
    }

    const apiKey = await ApiKey.findOne({
        keyId,
        isActive: true
    });
    console.log("API key found in database:",!!apiKey);

    if (!apiKey) {
        throw new apiErrors( 401, "Invalid API key");
    }

    console.log("Stored key ID:",apiKey.keyId);

    console.log("Stored hash exists:",!!apiKey.key);


    const isValid =await apiKey.compareApiKey(apiKeyValue);


    console.log("API key valid:",isValid);

    if (!isValid) {
        throw new apiErrors( 401, "Invalid API key" );
    }

    req.apiKey = apiKey;


    console.log( "API KEY VERIFIED SUCCESSFULLY");

    console.log( "Project ID:", apiKey.projectId);

    console.log("User ID:",apiKey.userId );
    next();

});