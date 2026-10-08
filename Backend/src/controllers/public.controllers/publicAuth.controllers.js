import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiErrors } from "../../utils/apiError.js";
import { apiResponce } from "../../utils/apiResponce.js";

import { Collection } from "../../models/collection.models.js";
import { Document } from "../../models/document.models.js";

import bcrypt from "bcryptjs";

const registerUser = asyncHandler(async (req, res) => {

    const { collectionId } = req.params;
    const { username, email, password } = req.body;

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }
    if (!username || !email || !password) {
        throw new apiErrors(
            400,
            "Username, email and password are required"
        );
    }
    const projectId = req.apiKey.projectId;

    const collection = await Collection.findOne({
        _id: collectionId,
        projectId: projectId
    });

    if (!collection) {
        throw new apiErrors( 404, "Collection not found" );
    }

    console.log("Collection:", collection.name);

    const existingUser = await Document.findOne({
        collectionId: collection._id,
        "data.email": email.toLowerCase()
    });

    if (existingUser) {
        throw new apiErrors(409,"User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Document.create({
        collectionId: collection._id,
        data: {
            username,
            email: email.toLowerCase(),
            password: hashedPassword
        }
    });

    return res.status(201).json(new apiResponce( 201,
         {
                _id: user._id,
                username: user.data.username,
                email: user.data.email
            },
            "User registered successfully"
        )
    );
});

export { registerUser };