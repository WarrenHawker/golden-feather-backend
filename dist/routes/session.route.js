"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//import packages
const express_1 = __importDefault(require("express"));
const delete_session_controller_1 = require("../controllers/session-controllers/delete-session.controller");
const get_sessions_controller_1 = require("../controllers/session-controllers/get-sessions.controller");
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
//initialise express router
exports.router = express_1.default.Router();
//all routes that come after this middleware are protected.
//can only be access if the user is logged in.
exports.router.use(require_auth_middleware_1.authenticate);
//get sessions route - Move to protected (admins only) in production
exports.router.get('/', get_sessions_controller_1.getSessions); //TODO implement page pagination
exports.router.delete('/:id', delete_session_controller_1.deleteSession);
