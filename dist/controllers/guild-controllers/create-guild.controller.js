"use strict";
/*
  "create guild" controller function

  Creates a new guild in the database.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGuild = void 0;
const logger_service_1 = require("../../services/logger.service");
const validator_1 = __importDefault(require("validator"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const { isEmpty, escape } = validator_1.default;
const createGuild = async (req, res) => {
    let { name, region, language, bio, guildLeader } = req.body;
    const missingFields = [];
    if (!name) {
        missingFields.push('name');
    }
    if (!region) {
        missingFields.push('region');
    }
    if (!language) {
        missingFields.push('language');
    }
    if (!bio) {
        missingFields.push('bio');
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
    if (isEmpty(region, { ignore_whitespace: true })) {
        emptyFields.push('region');
    }
    if (isEmpty(language, { ignore_whitespace: true })) {
        emptyFields.push('language');
    }
    if (isEmpty(bio, { ignore_whitespace: true })) {
        emptyFields.push('bio');
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
    const guildData = {
        name: escape(name).trim(),
        region: escape(region).trim(),
        language: escape(language).trim(),
        bio: escape(bio).trim(),
        guild_leader: guildLeader || null,
        created_on: new Date(),
        status: 'public',
    };
    try {
        const guild = await client_prisma_1.prismaClient.guild.create({ data: guildData });
        res.status(201).json(guild);
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
exports.createGuild = createGuild;
