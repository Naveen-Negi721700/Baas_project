import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app=express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true,
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())


import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import apiKeyRoutes from "./routes/apiKey.routes.js";
import collectionRoutes from "./routes/collection.routes.js";

app.use("/api/v1/Baas", authRoutes);
app.use("/api/v1/Baas", projectRoutes);
app.use("/api/v1/Baas", apiKeyRoutes);
app.use("/api/v1/Baas", collectionRoutes);


// app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/projects", projectRoutes);
// app.use("/api/v1/api-keys", apiKeyRoutes);
// app.use("/api/v1/collections", collectionRoutes);
export default app
