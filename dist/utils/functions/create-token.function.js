"use strict";
/*
  "create token" function

  Generates a random 32bit token and stores it in the authToken database table.
  Used when a new user account is created - used to verify user email.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const crypto_1 = __importDefault(require("crypto"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const createToken = async (id) => {
    //create random 32bit string for the token
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const tokenData = {
        user_id: id,
        created_on: new Date(),
        expires_on: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
        //token expires 24 hours after creation
        token: token,
    };
    //stores token in database
    try {
        const token = await client_prisma_1.prismaClient.authToken.create({ data: tokenData });
        return token;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.createToken = createToken;
