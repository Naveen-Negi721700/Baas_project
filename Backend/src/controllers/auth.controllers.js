import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { User } from "../models/user.model.js";


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log('username is ', username);
    console.log('email is ', email);
    console.log('password is ', password);

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new apiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if (!avatarLocalPath) {
        throw new apiError(400, "Avatar image is required")
    }
    
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

})

export { registerUser }