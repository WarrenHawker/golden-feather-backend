"use strict";
/*
  "session creation" service

  Uses the express-session package to store user signin session
  in the redis database.

  For more information, go to https://expressjs.com/en/resources/middleware/session.html
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import packages
const express_session_1 = __importDefault(require("express-session"));
const client_redis_1 = require("../lib/redis/client.redis");
require("dotenv/config");
exports.default = (0, express_session_1.default)({
    store: client_redis_1.redisStore,
    secret: process.env.SECRET || '',
    saveUninitialized: false,
    resave: false,
    name: 'sessionId',
    cookie: {
        secure: false, //if true, only transmit cookie over https
        httpOnly: true, //if true, prevents client side JS from reading cookie
        maxAge: 1000 * 60 * 30, //session max age in milliseconds
    },
});
