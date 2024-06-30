"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisStore = exports.redisClient = void 0;
//import packages
const redis_1 = require("redis");
const connect_redis_1 = __importDefault(require("connect-redis"));
require("dotenv/config");
//initialise redis client
exports.redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL || '',
    socket: {
        connectTimeout: 50000,
    },
});
//initialise redis store
exports.redisStore = new connect_redis_1.default({ client: exports.redisClient });
