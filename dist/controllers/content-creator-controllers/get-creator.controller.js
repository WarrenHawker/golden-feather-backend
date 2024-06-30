"use strict";
/*
  "get content creator" controller function

  retrives all content creators from the database.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCreators = void 0;
const logger_service_1 = require("../../services/logger.service");
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const getCreators = async (req, res) => {
    try {
        const creators = await client_prisma_1.prismaClient.contentCreator.findMany();
        res.status(200).json(creators);
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
exports.getCreators = getCreators;
