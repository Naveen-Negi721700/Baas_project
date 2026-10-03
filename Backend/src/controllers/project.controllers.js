import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { User } from "../models/user.models.js";
import { Project } from "../models/project.models.js"

const createProject = asyncHandler(async (req, res) => {
    if (!req.user) {
        throw new apiErrors(401, "User not found")
    }
    const { title, description } = req.body;

    if ([title, description].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fields are required")
    }

    const existingProject = await Project.findOne({ userId: req.user._id, name: title });
    if (existingProject) {
        throw new apiErrors(400, "Project with the same name already exists");
    }

    const newProject = await Project.create({
        userId: req.user._id,
        name: title,
        description: description,
    })
    const createdProject = await Project.findById(newProject._id).select("-secretKey -publicKey ")
    console.log('createdProject is ', createdProject);
    return res.status(201).json(new apiResponce(201, createdProject, "Project created successfully"))
})

const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({ userId: req.user._id }).select("-secretKey -publicKey");
    if (!projects) {
        throw new apiErrors(404, "No projects found for the user");
    }
    return res.status(200).json(new apiResponce(200, projects, "Projects fetched successfully"));
})

const getProject= asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if(!projectId){
        throw new apiErrors(400, "Project ID is required");
    }

    const project=await Project.findOne({ _id: projectId, userId: req.user._id }).select("-secretKey -publicKey");
    if(!project){
        throw new apiErrors(404, "Project not found");
    }
    return res.status(200).json(new apiResponce(200, project, "Project fetched successfully"));

})

const updateProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if(!projectId){
        throw new apiErrors(400, "Project ID is required");
    }
    const { title, description } = req.body;
    if ([title, description].some((field) => field?.trim() === "")) {
        throw new apiErrors(400, "All fields are required")
    }
    const project = await Project.findOneAndUpdate(
        { _id: projectId, userId: req.user._id },
        { name: title, description: description },
        { new: true }
    ).select("-secretKey -publicKey");
    if (!project) {
        throw new apiErrors(404, "Project not found");
    }
    return res.status(200).json(new apiResponce(200, project, "Project updated successfully"));
})

const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    if(!projectId){
        throw new apiErrors(400, "Project ID is required");
    }
    const project = await Project.findOneAndDelete({ _id: projectId, userId: req.user._id });
    if (!project) {
        throw new apiErrors(404, "Project not found");
    }
    return res.status(200).json(new apiResponce(200, project, "Project deleted successfully"));
})


export { createProject, getProjects, getProject, updateProject, deleteProject }