"use strict";
/*
  "create content creator" controller function

  Creates a new content creator in the database.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCreator = void 0;
const logger_service_1 = require("../../services/logger.service");
const validator_1 = __importDefault(require("validator"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const sanitise_array_function_1 = require("../../utils/functions/sanitise-array.function");
const sanitise_object_function_1 = require("../../utils/functions/sanitise-object.function");
const { isEmpty, escape, isURL } = validator_1.default;
const createCreator = async (req, res) => {
    let { name, description, categories, socials, videoUrl } = req.body;
    const missingFields = [];
    if (!name) {
        missingFields.push('name');
    }
    if (!description) {
        missingFields.push('description');
    }
    if (!categories) {
        missingFields.push('categories');
    }
    if (!videoUrl) {
        missingFields.push('videoUrl');
    }
    if (missingFields.length > 0) {
        const error = {
            code: 400,
            message: 'Missing body parameters',
            params: missingFields,
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    const emptyFields = [];
    if (isEmpty(name, { ignore_whitespace: true })) {
        emptyFields.push('name');
    }
    if (isEmpty(description, { ignore_whitespace: true })) {
        emptyFields.push('description');
    }
    if (isEmpty(videoUrl, { ignore_whitespace: true })) {
        emptyFields.push('videoUrl');
    }
    if (emptyFields.length > 0) {
        const error = {
            code: 400,
            message: 'Empty input fields',
            params: emptyFields,
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    const creatorData = {
        name: escape(name).trim(),
        description: escape(description).trim(),
        categories: (0, sanitise_array_function_1.sanitiseArray)(categories),
        socials: (0, sanitise_object_function_1.sanitiseObject)(socials),
        videoUrl: isURL(videoUrl) ? videoUrl.trim() : '',
        created_on: new Date(),
        status: 'public',
    };
    try {
        const creator = await client_prisma_1.prismaClient.contentCreator.create({
            data: creatorData,
        });
        res.status(201).json(creator);
    }
    catch (err) {
        const error = {
            code: 500,
            message: err.message,
        };
        res.status(500).json(error);
        (0, logger_service_1.createLog)('critical', req, res, error);
        return;
    }
};
exports.createCreator = createCreator;
