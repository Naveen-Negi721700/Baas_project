import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";
import { Project } from "../models/project.models.js";
import { Collection } from "../models/collection.models.js";


const createCollection = asyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { name, schema } = req.body;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    if (!name || name.trim() === "") {
        throw new apiErrors(400, "Collection name is required");
    }

    if (!schema || typeof schema !== "object" || Array.isArray(schema) || Object.keys(schema).length === 0) {
        throw new apiErrors(400, "Collection schema is required");
    }

    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.create({
        projectId: project._id,
        name,
        schema,
        isSystem: false,
    });

    return res.status(201).json(new apiResponce(201, collection, "Collection created successfully"));

})

const getCollections = asyncHandler(async (req, res) => {

    const { projectId } = req.params;


    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }


    const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id
    });

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }


    const collections = await Collection.find({
        projectId: project._id
    });


    if (!collections || collections.length === 0) {
        throw new apiErrors(404, "No collections found for this project");
    }


    return res.status(200).json(
        new apiResponce(
            200,
            collections,
            "Collections retrieved successfully"
        )
    );
});

const getCollection = asyncHandler(async (req, res) => {

    const { projectId, collectionId } = req.params;


    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    const project = await Project.findOne({
        _id: projectId,
        userId: req.user._id
    });

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }


    const collection = await Collection.findOne({
        _id: collectionId,
        projectId: project._id
    });


    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    return res.status(200).json(
        new apiResponce(
            200,
            collection,
            "Collection retrieved successfully"
        )
    );
});

const updateCollection = asyncHandler(async (req, res) => {
    const { projectId, collectionId } = req.params;
    const { name, schema } = req.body;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    if (!name || name.trim() === "") {
        throw new apiErrors(400, "Collection name is required");
    }

    if (!schema || Object.keys(schema).length === 0 || typeof schema !== "object" || Array.isArray(schema)) {
        throw new apiErrors(400, "Collection schema is required");
    }


    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.findOne({ _id: collectionId, projectId: project._id });
    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        collection._id,
        { name: name.trim(), schema: schema },
        { new: true }
    );

    return res.status(200).json(new apiResponce(200, updatedCollection, "Collection updated successfully"));
});

const deleteCollection = asyncHandler(async (req, res) => {
    const { projectId, collectionId } = req.params;
    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }
    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    const project = await Project.findOne({ _id: projectId, userId: req.user._id });
    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.findOne({ _id: collectionId, projectId: project._id });
    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    await Collection.findByIdAndDelete(collection._id);

    return res.status(200).json(new apiResponce(200, null, "Collection deleted successfully"));
});


export { createCollection, getCollections, getCollection, updateCollection, deleteCollection };