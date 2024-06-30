"use strict";
/*
  "update content creator" controller function

  Updates an existing content creator from the database by the id property, using data from the body params.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCreator = void 0;
const validator_1 = __importDefault(require("validator"));
const sanitise_array_function_1 = require("../../utils/functions/sanitise-array.function");
const sanitise_object_function_1 = require("../../utils/functions/sanitise-object.function");
const validate_input_function_1 = require("../../utils/functions/validate-input.function");
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const { isEmpty, escape, isURL } = validator_1.default;
const updateCreator = async (req, res) => {
    let { name, description, categories, socials, videoUrl, status } = req.body;
    const creatorId = req.params.id;
    const updateData = {
        updated_on: new Date(),
    };
    if (name) {
        name = escape(name).trim();
        if (!isEmpty(name, { ignore_whitespace: true })) {
            updateData.name = name;
        }
    }
    if (description) {
        description = escape(description).trim();
        if (!isEmpty(description, { ignore_whitespace: true })) {
            updateData.description = description;
        }
    }
    if (categories) {
        updateData.categories = (0, sanitise_array_function_1.sanitiseArray)(categories);
    }
    if (socials) {
        updateData.socials = (0, sanitise_object_function_1.sanitiseObject)(socials);
    }
    if (videoUrl) {
        if (!isURL(videoUrl)) {
            const error = {
                code: 400,
                message: 'Invalid "videoUrl" body parameter.',
                params: ['videoUrl'],
            };
            res.status(400).json(error);
            return;
        }
        else {
            updateData.videoUrl = videoUrl.trim();
        }
    }
    if (status) {
        if (!(0, validate_input_function_1.isContentStatus)(status)) {
            const error = {
                code: 400,
                message: 'Invalid "status" body parameter.',
                params: ['status'],
            };
            res.status(400).json(error);
            return;
        }
        else {
            updateData.status = status.trim();
        }
    }
    try {
        const creator = await client_prisma_1.prismaClient.contentCreator.update({
            where: { id: creatorId },
            data: updateData,
        });
        res.status(200).json(creator);
        return;
    }
    catch (err) {
        const error = {
            code: 500,
            message: err.message,
        };
        res.status(500).json(error);
        return;
    }
};
exports.updateCreator = updateCreator;
