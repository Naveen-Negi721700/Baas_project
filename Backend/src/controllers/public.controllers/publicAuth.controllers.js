import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiErrors } from "../../utils/apiError.js";
import { apiResponce } from "../../utils/apiResponce.js";

import { Collection } from "../../models/collection.models.js";
import { Document } from "../../models/document.models.js";

import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {

    const { collectionId } = req.params;
    const { name, email, password } = req.body;

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    if (!name || !email || !password) {
        throw new apiErrors(
            400,
            "Name, email and password are required"
        );
    }

    // Project comes from API key
    const projectId = req.apiKey.projectId;

    // Find collection belonging to this project
    const collection = await Collection.findOne({
        _id: collectionId,
        projectId: projectId
    });

    if (!collection) {
        throw new apiErrors(
            404,
            "Collection not found"
        );
    }

    // Now you know exactly which collection to use
    console.log(collection.name);

    // Check existing user
    const existingUser = await Document.findOne({
        collectionId: collection._id,
        "data.email": email.toLowerCase()
    });

    if (existingUser) {
        throw new apiErrors(
            409,
            "User with this email already exists"
        );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await Document.create({
        collectionId: collection._id,
        data: {
            name,
            email: email.toLowerCase(),
            password: hashedPassword
        }
    });

    return res.status(201).json(
        new apiResponce(
            201,
            {
                _id: user._id,
                name: user.data.name,
                email: user.data.email
            },
            "User registered successfully"
        )
    );
});

export { registerUser };