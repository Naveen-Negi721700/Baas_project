import express from "express";
const app=express()



import routes from "./routes/user.routes.js";
app.use("/api/v1/Baas", routes);
export default app
