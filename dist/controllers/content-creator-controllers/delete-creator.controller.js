"use strict";
/*
  "delete content creator" controller function

  Deletes an existing content creator from the database by the id property.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCreator = void 0;
const validator_1 = __importDefault(require("validator"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const logger_service_1 = require("../../services/logger.service");
const { escape, isEmpty } = validator_1.default;
const deleteCreator = async (req, res) => {
    let id = req.params.id;
    //check ID param exists
    if (!id || isEmpty(id, { ignore_whitespace: true })) {
        const error = {
            code: 400,
            message: 'no ID given',
            params: ['id'],
        };
        res.status(400).json(error);
        return;
    }
    //sanitise ID param
    id = escape(id).trim();
    //try deleting entry
    try {
        const deletedEntry = await client_prisma_1.prismaClient.contentCreator.delete({
            where: { id: id },
        });
        res.status(200).json(deletedEntry);
        (0, logger_service_1.createLog)('info', req, res);
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
exports.deleteCreator = deleteCreator;
