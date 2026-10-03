import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";

import { User } from "../models/user.models.js";

import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async(req,res,next)=>{
try {
    const token=req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new apiErrors(401,"Unauthorized")
    }
    const decoded=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
    const user=await User.findById(decoded._id).select("-password");
    if(!user){
        throw new apiErrors(404,"User not found")
    }
    req.user=user;  
    next();
} catch (error) {
    throw new apiErrors(401, error?.message || "invalid access token")
}
})
