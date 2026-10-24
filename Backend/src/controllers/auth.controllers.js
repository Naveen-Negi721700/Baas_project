import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.models.js";
import { UserSessions } from "../models/userSession.models.js";
import { uploadOnCloudinary } from "../utils/cloudineary.js"
import jwt from "jsonwebtoken";
import { sendWelcomeEmail } from "../middlewares/email.js";
import { sendLoginEmail } from "../middlewares/email.js";


const getAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);

        if (!user) {
            throw new apiErrors(404, "User not found");
        }

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const userSession = await UserSessions.findOne({
            userId: user._id
        });

        if (userSession) {
            userSession.refreshToken = refreshToken;
            userSession.expiresAt = new Date(
                Date.now() + 10 * 24 * 60 * 60 * 1000
            );

            await userSession.save();
        } else {
            await UserSessions.create({
                userId: user._id,
                refreshToken,
                expiresAt: new Date(
                    Date.now() + 10 * 24 * 60 * 60 * 1000
                )
            });
        }

        return { accessToken, refreshToken };
    } catch (error) {
        if (error instanceof apiErrors) {
            throw error;
        }

        throw new apiErrors(500, "Failed to generate tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log('username is ', username);
    console.log('email is ', email);
    console.log('password is ', password);

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fields are required")
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

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if (existingUser) {
        throw new apiErrors(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if (!avatarLocalPath) {
        throw new apiErrors(400, "Avatar image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("avatar upload result:", avatar)


    if (!avatar) {
        throw new apiErrors(400, "avatar is required")

    }

    const user = await User.create({
        username,
        email,
        password,
        avatar: avatar.url
    })

    try {
        await sendWelcomeEmail(user.email, user.username);
        console.log("Welcome email sent successfully");
    } catch (error) {
        console.error("Welcome email failed:", error.message);
    }


    const createdUser = await User.findById(user._id).select("-password ")
    if (!createdUser) {
        throw new apiErrors(500, "User creation failed")
    }

    console.log("user register successfully:", createdUser)

    return res.status(201).json(
        new apiResponce(201, createdUser, "User register successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    // Step 1: Validate input
    if (!usernameOrEmail?.trim() || !password) {
        throw new apiErrors(
            400,
            "Username/email and password are required"
        );
    }

    const loginIdentifier = usernameOrEmail.trim();

    // Step 2: Validate Gmail address if the user enters an email
    if (loginIdentifier.includes("@")) {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/i;

        if (!gmailRegex.test(loginIdentifier)) {
            throw new apiErrors(
                400,
                "Please enter a valid Gmail address"
            );
        }
    }

    // Step 3: Find user by username or email
    const user = await User.findOne({
        $or: [
            { username: loginIdentifier },
            { email: loginIdentifier.toLowerCase() }
        ]
    });

    if (!user) {
        throw new apiErrors(401, "Invalid username/email or password");
    }

    // Step 4: Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new apiErrors(401, "Invalid username/email or password");
    }

    // Step 5: Generate access and refresh tokens
    const { accessToken, refreshToken } =
        await getAccessAndRefreshToken(user._id);

    // Step 6: Send login notification to the registered email
    // Email failure must not prevent a successful login.
    try {
        const info = await sendLoginEmail(user.email, user.username);

        console.log("Login notification sent:", info.messageId);
    } catch (error) {
        console.error("Login email failed:", error.message);
    }

    // Step 7: Fetch user data without sensitive fields
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    if (!loggedInUser) {
        throw new apiErrors(500, "Unable to fetch logged-in user");
    }

    // Step 8: Configure cookies
    const isProduction = process.env.NODE_ENV === "production";

    const accessTokenOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 15 * 60 * 1000 // 15 minutes
    };

    const refreshTokenOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
    };

    // Step 9: Send cookies and response
    return res
        .status(200)
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .json(
            new apiResponce(
                200,
                loggedInUser,
                "User logged in successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    await UserSessions.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken: undefined,
            }
        }
    )


    // const options = {
    //     httpOnly: true,
    //     secure: true,
    //     sameSite: "none",
    //     path: "/"
    // };

    const options = {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/"
    };

    console.log("user logged out successfully", req.user);

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new apiResponce(200, null, "User logged out successfully"))
})

const getCurrentUser = asyncHandler(async (req,res)=>{
    console.log("current user fetched successfully", req.user);
    return res.status(200).json(new apiResponce(200, req.user, "Current user fetched successfully"))
})

const refreshaccessToken = asyncHandler(async (req, res) => {
    console.log("Refresh token route called");

    // Step 1: Get the refresh token from the cookie
    // or Authorization header
    const incomingRefreshToken =
        req.cookies?.refreshToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    console.log(
        "Refresh token received:",
        incomingRefreshToken ? "YES" : "NO"
    );

    if (!incomingRefreshToken) {
        throw new apiErrors(401, "Refresh token missing");
    }

    try {
        // Step 2: Verify the refresh token
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        // Step 3: Find the user
        const user = await User.findById(decodedToken._id);

        if (!user) {
            throw new apiErrors(401, "User not found");
        }

        // Step 4: Verify the session and token expiration
        const userSession = await UserSessions.findOne({
            userId: user._id,
            refreshToken: incomingRefreshToken,
            expiresAt: { $gt: new Date() }
        });

        if (!userSession) {
            throw new apiErrors(
                401,
                "Invalid or expired refresh token session"
            );
        }

        // Step 5: Generate new tokens
        const { accessToken, refreshToken } =
            await getAccessAndRefreshToken(user._id);

        if (!accessToken || !refreshToken) {
            throw new apiErrors(500, "Failed to generate tokens");
        }

        // Step 6: Configure persistent cookies
        const isProduction = process.env.NODE_ENV === "production";

        const accessTokenOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 15 * 60 * 1000 // 15 minutes
        };

        const refreshTokenOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
            path: "/",
            maxAge: 10 * 24 * 60 * 60 * 1000 // 10 days
        };

        // Step 7: Send new cookies and response
        return res
            .status(200)
            .cookie(
                "accessToken",
                accessToken,
                accessTokenOptions
            )
            .cookie(
                "refreshToken",
                refreshToken,
                refreshTokenOptions
            )
            .json(
                new apiResponce(
                    200,
                    { accessToken, refreshToken },
                    "Access token refreshed successfully"
                )
            );

    } catch (error) {
        if (error instanceof apiErrors) {
            throw error;
        }

        throw new apiErrors(
            401,
            error.name === "TokenExpiredError"
                ? "Refresh token has expired"
                : "Invalid refresh token"
        );
    }
});


export { registerUser, loginUser, logoutUser, getCurrentUser, refreshaccessToken }

