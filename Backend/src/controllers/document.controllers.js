
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiErrors } from "../utils/apiError.js";
import { apiResponce } from "../utils/apiResponce.js";

import { Project } from "../models/project.models.js";
import { Document } from "../models/document.models.js";
import { Collection } from "../models/collection.models.js";


const createDocument = asyncHandler(async (req, res) => {

    const { projectId, collectionId } = req.params;
    const data = req.body;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    if (!data ||typeof data !== "object" ||Array.isArray(data) || Object.keys(data).length === 0) {
        throw new apiErrors(400, "Document data is required");
    }

    const project = await Project.findOne({ _id: projectId, userId: req.user._id});

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.findOne({ _id: collectionId, projectId: project._id});

    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    const document = await Document.create({
        collectionId: collection._id,
        data: data
    });


    console.log("document is", document);

    return res.status(201).json(new apiResponce( 201, document, "Document created successfully") );
});

const getDocuments = asyncHandler(async (req, res) => {

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

    const documents = await Document.find({
        collectionId: collection._id
    });

    if (!documents || documents.length === 0) {
        throw new apiErrors(404, "No documents found");
    }
    return res.status(200).json(new apiResponce(200,documents,"Documents retrieved successfully") );
});

const getDocument = asyncHandler(async (req, res) => {

    const { projectId, collectionId, documentId } = req.params;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }
    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    if (!documentId) {
        throw new apiErrors(400, "Document ID is required");
    }

    const project = await Project.findOne({_id: projectId,userId: req.user._id});

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }
    const collection = await Collection.findOne({ _id: collectionId,projectId: project._id});

    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }


    const document = await Document.findOne({_id: documentId,collectionId: collection._id });

    if (!document) {
        throw new apiErrors(404, "Document not found");
    }

    return res.status(200).json(new apiResponce(200,document,"Document retrieved successfully"));
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

    if (!schema ||typeof schema !== "object" ||Array.isArray(schema) ||Object.keys(schema).length === 0) {
        throw new apiErrors(400, "Collection schema is required");
    }

    const project = await Project.findOne({_id: projectId,userId: req.user._id });

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.findOne({ _id: collectionId, projectId: project._id});

    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    const updatedCollection = await Collection.findByIdAndUpdate(
        collection._id,
        {
            name: name.trim(),
            schema: schema
        },
        {
            new: true
        }
    );

    return res.status(200).json(new apiResponce( 200, updatedCollection, "Collection updated successfully"));
});

const deleteCollection = asyncHandler(async (req, res) => {

    const { projectId, collectionId } = req.params;

    if (!projectId) {
        throw new apiErrors(400, "Project ID is required");
    }

    if (!collectionId) {
        throw new apiErrors(400, "Collection ID is required");
    }

    const project = await Project.findOne({_id: projectId, userId: req.user._id });

    if (!project) {
        throw new apiErrors(404, "Project not found");
    }

    const collection = await Collection.findOne({ _id: collectionId, projectId: project._id});

    if (!collection) {
        throw new apiErrors(404, "Collection not found");
    }

    await Collection.findByIdAndDelete(collection._id);

    return res.status(200).json(new apiResponce( 200, null, "Collection deleted successfully"));
});
export { createDocument, getDocuments, getDocument, updateCollection, deleteCollection };
