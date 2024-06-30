"use strict";
/*
  "update guild" controller function

  Updates an existing guild from the database by the id property, using data from the body params.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGuild = void 0;
const validator_1 = __importDefault(require("validator"));
const validate_input_function_1 = require("../../utils/functions/validate-input.function");
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const { isEmpty, escape } = validator_1.default;
const updateGuild = async (req, res) => {
    let { name, region, language, bio, guildLeader, status } = req.body;
    const guildId = req.params.id;
    const updateData = {
        updated_on: new Date(),
    };
    if (name) {
        name = escape(name).trim();
        if (!isEmpty(name, { ignore_whitespace: true })) {
            updateData.name = name;
        }
    }
    if (region) {
        region = escape(region).trim();
        if (!isEmpty(region, { ignore_whitespace: true })) {
            updateData.region = region;
        }
    }
    if (language) {
        region = escape(language).trim();
        if (!isEmpty(language, { ignore_whitespace: true })) {
            updateData.language = language;
        }
    }
    if (bio) {
        bio = escape(bio).trim();
        if (!isEmpty(bio, { ignore_whitespace: true })) {
            updateData.bio = bio;
        }
    }
    if (guildLeader) {
        guildLeader = escape(guildLeader).trim();
        if (!isEmpty(guildLeader, { ignore_whitespace: true })) {
            updateData.guild_leader = guildLeader;
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
        const guild = await client_prisma_1.prismaClient.guild.update({
            where: { id: guildId },
            data: updateData,
        });
        res.status(200).json(guild);
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
exports.updateGuild = updateGuild;
