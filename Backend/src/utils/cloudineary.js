import { v2 as cloudinary } from 'cloudinary'
import fs from "node:fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINEARY_CLOUD_NAME,
    api_key: process.env.CLOUDINEARY_API_KEY,
    api_secret: process.env.CLOUDINEARY_API_SECRET
});