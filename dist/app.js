"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
//import packages
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("./routes/auth.route");
const session_route_1 = require("./routes/session.route");
const log_route_1 = require("./routes/log.route");
const creator_route_1 = require("./routes/creator.route");
const guild_route_1 = require("./routes/guild.route");
const session_service_1 = __importDefault(require("./services/session.service"));
const rate_limiter_middleware_1 = require("./middleware/rate-limiter.middleware");
//initialise express app
exports.app = (0, express_1.default)();
//middleware
exports.app.use(session_service_1.default);
exports.app.use(rate_limiter_middleware_1.rateLimiter);
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
// Base API path
const apiBasePath = '/api/v1';
// Routes
exports.app.use(`${apiBasePath}/auth`, auth_route_1.router);
exports.app.use(`${apiBasePath}/session`, session_route_1.router);
exports.app.use(`${apiBasePath}/log`, log_route_1.router);
exports.app.use(`${apiBasePath}/guild`, guild_route_1.router);
exports.app.use(`${apiBasePath}/creator`, creator_route_1.router);
