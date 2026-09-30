import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudineary.js"


const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;

    console.log('username is ', username);
    console.log('email is ', email);
    console.log('password is ', password);

    if ([username, email, password].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if (existingUser) {
        throw new apiErrors(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar?.[0]?.path
    if (!avatarLocalPath) {
        throw new apiErrors (400, "Avatar image is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    console.log("avatar upload result:", avatar)


    if (!avatar) {
        throw new apiErrors(400, "avatar is required")

    }

    const user=await User.create({
        username,
        email,
        password,
        avatar: avatar.url
    })


   const createdUser = await User.findById(user._id).select("-password -refreshToken") 
   if (!createdUser) {
    throw new apiErrors(500, "User creation failed")
   }

   return res.status(201).json(
        new apiResponce(201, createdUser, "User register successfully")
    )

})

export { registerUser }