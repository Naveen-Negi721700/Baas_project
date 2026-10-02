import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.models.js";
import { UserSessions } from "../models/userSession.models.js";
import { uploadOnCloudinary } from "../utils/cloudineary.js"


const getAccessAndRefreshToken = async (userId) => {

    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new apiErrors(404, "User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        const userSession = await UserSessions.findOne({ userId: user._id });
        if (userSession) {
            userSession.refreshToken = refreshToken;
            userSession.expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000);
            await userSession.save();
        } else {
            await UserSessions.create({
                userId: user._id,
                refreshToken: refreshToken,
                expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            });
        }
        // await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiErrors(500, "Failed to generate tokens");
    }
}

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


    const createdUser = await User.findById(user._id).select("-password ")
    if (!createdUser) {
        throw new apiErrors(500, "User creation failed")
    }

    return res.status(201).json(
        new apiResponce(201, createdUser, "User register successfully")
    )

})

const loginUser = asyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
        throw new apiErrors(400, "Username/email and password are required");
    }

    const loginIdentifier = usernameOrEmail;
    if (loginIdentifier.includes("@")) {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(loginIdentifier)) {
        throw new apiErrors(
            400,
            "Please enter a valid Gmail address"
        );
    }
}

    const user = await User.findOne({
        $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    })
    if (!user) {
        throw new apiErrors(404, "User not found");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new apiErrors(401, "Invalid password");
    }
    const { accessToken, refreshToken } = await getAccessAndRefreshToken(user._id);

    const loginUser = await User.findById(user._id).select("-password");

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

    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new apiResponce(200, loginUser, "User logged in successfully")
    )

})

export { registerUser, loginUser }