import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error.middleware.js";
import { globalLimiter } from "./middlewares/ratelimiter.middlewares.js";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import apiKeyRoutes from "./routes/apiKey.routes.js";
import collectionRoutes from "./routes/collection.routes.js";
import documentRoutes from "./routes/document.routes.js";
import publicRoutes from "./routes/public.routes/public.routes.js";
import aiRouter from "./routes/ai.routes.js";


const app=express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))
console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// only behind a proxy or host (Render, nginx...), otherwise the IP can be faked
if (process.env.NODE_ENV === "production") app.set("trust proxy", 1);

app.use("/api", globalLimiter);

// it the mount of routes
app.use("/api/v1/Baas", authRoutes);
app.use("/api/v1/Baas", projectRoutes);
app.use("/api/v1/Baas", apiKeyRoutes);
app.use("/api/v1/Baas", collectionRoutes);
app.use("/api/v1/Baas", documentRoutes);

// it is for public
app.use("/api/v1/public", publicRoutes);

// it is a for ai 
app.use("/api/v1/Baas", aiRouter);

// it is for error handling 
app.use(errorHandler);

export default app
