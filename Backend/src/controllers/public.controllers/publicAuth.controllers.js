// import { asyncHandler } from "../../utils/asyncHandler.js";
// import { apiErrors } from "../../utils/apiError.js";
// import { apiResponce } from "../../utils/apiResponce.js";

// import { Collection } from "../../models/collection.models.js";
// import { Document } from "../../models/document.models.js";

// import bcrypt from "bcryptjs";

// const registerUser = asyncHandler(async (req, res) => {

//     const { name, email, password } = req.body;

//     // Check required fields
//     if ([name, email, password].some((field) => field?.trim() === "")) {
//         throw new apiErrors(400, "All fields are required");
//     }

//     // Get project from API key
//     const projectId = req.apiKey.projectId;

//     // Find users collection of this project
//     const usersCollection = await Collection.findOne({
//         projectId: projectId,
//         name: "users"
//     });

//     if (!usersCollection) {
//         throw new apiErrors(404, "Users collection not found");
//     }

//     // Check if email already exists
//     const existingUser = await Document.findOne({
//         collectionId: usersCollection._id,
//         "data.email": email
//     });

//     if (existingUser) {
//         throw new apiErrors(409, "User with this email already exists");
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create user document
//     const user = await Document.create({
//         collectionId: usersCollection._id,
//         data: {
//             name,
//             email,
//             password: hashedPassword
//         }
//     });

//     // Don't send password to client
//     const userData = {
//         _id: user._id,
//         name: user.data.name,
//         email: user.data.email
//     };

//     return res
//         .status(201)
//         .json(
//             new apiResponce(
//                 201,
//                 userData,
//                 "User registered successfully"
//             )
//         );
// });

// export { registerUser };