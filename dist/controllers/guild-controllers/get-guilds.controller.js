"use strict";
/*
  "get guild" controller function

  retrives all guilds from the database.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGuilds = void 0;
const logger_service_1 = require("../../services/logger.service");
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const getGuilds = async (req, res) => {
    try {
        const guilds = await client_prisma_1.prismaClient.guild.findMany();
        res.status(200).json(guilds);
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
exports.getGuilds = getGuilds;
