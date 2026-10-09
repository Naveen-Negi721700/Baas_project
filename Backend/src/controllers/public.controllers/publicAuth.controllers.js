import { asyncHandler } from "../../utils/asyncHandler.js";
import { apiErrors } from "../../utils/apiError.js";
import { apiResponce } from "../../utils/apiResponce.js";

import { Collection } from "../../models/collection.models.js";
import { Document } from "../../models/document.models.js";


const getAccessAndRefreshToken = async (documentUserId,projectId,collectionId) => {
    try {
        // 1. Find the user document
        const documentUser = await Document.findOne({
        _id: documentUserId,
        collectionId
    });

        if (!documentUser) {
            throw new apiErrors(404, "User not found");
        }

        // 2. Generate tokens for this user
        const accessToken = documentUser.generateAccessToken();
        const refreshToken = documentUser.generateRefreshToken();

        // 3. Find an existing refresh-token session
        const expiresAt = new Date(
        Date.now() + 10 * 24 * 60 * 60 * 1000
    );

    await ProjectUserSession.create({
        projectId,
        collectionId,
        documentUserId: documentUser._id,
        refreshToken,
        expiresAt
    });
        return {
            accessToken,
            refreshToken
        };

    } catch (error) {
        console.error("Token generation error:", error);

        throw new apiErrors(500, "Failed to generate tokens");
    }
};
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

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
        throw new apiErrors(
            400,
            "Please enter a valid Gmail address"
        );
    }

    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
        throw new apiErrors(
            400,
            "Password must be at least 8 characters and contain uppercase, lowercase, number and special character"
        );
    }


    const projectId = req.apiKey.projectId;

    const collection = await Collection.findOne({
        _id: collectionId,
        projectId: projectId
    });

    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    console.log("Collection:", collection.name);
    const normalizedUsername = username.trim().toLowerCase();
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await Document.findOne({
        collectionId: collection._id,
        $or: [
            { "data.email": normalizedEmail },
            { "data.username": normalizedUsername }
        ]
    });

    if (existingUser) {
        if (existingUser.data.email === normalizedEmail) {
            throw new apiErrors(
                409,
                "User with this email already exists"
            );
        }

        if (existingUser.data.username === normalizedUsername) {
            throw new apiErrors(409, "Username already exists");
        }
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Document.create({
        collectionId: collection._id,
        data: {
            username: normalizedUsername,
            email: normalizedEmail,
            password: password
        }
    });

    return res.status(201).json(new apiResponce(201,
        {
            _id: user._id,
            username: user.data.username,
            email: user.data.email
        },
        "User registered successfully"
    )
    );
});
const loginUser = asyncHandler(async (req, res) => {
    const { collectionId } = req.params;
    const { usernameOrEmail, password } = req.body;
    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }
    if (!usernameOrEmail || !password) {
        throw new apiErrors(400, "Username/email and password are required");
    }


    const loginIdentifier = usernameOrEmail.trim().toLowerCase();
    if (loginIdentifier.includes("@")) {
       const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!gmailRegex.test(loginIdentifier)) {
            throw new apiErrors(
                400,
                "Please enter a valid Gmail address"
            );
        }
    }

    const projectId = req.apiKey.projectId;
    const collection = await Collection.findOne({
        _id: collectionId,
        projectId: projectId
    });
    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    const DocumentUser = await Document.findOne({
        collectionId: collection._id,
        $or: [
            { "data.email": loginIdentifier },
            { "data.username": loginIdentifier }
        ]
    })

    if (!DocumentUser) { throw new apiErrors(401, "Invalid username/email or password"); }


    const isPasswordValid = await DocumentUser.comparePassword(password);
    if (!isPasswordValid) {
        throw new apiErrors(401, "Invalid username/email or password");
    }

 const { accessToken, refreshToken } =await getAccessAndRefreshToken(DocumentUser._id,projectId,collection._id);
    const loggedInUser = {
        _id: DocumentUser._id,
        collectionId: DocumentUser.collectionId,
        username: DocumentUser.data.username,
        email: DocumentUser.data.email
    };


    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    };
    console.log("user login successfully", loggedInUser);


    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new apiResponce(200, loggedInUser, "User logged in successfully")
    )


})

export { registerUser, loginUser };