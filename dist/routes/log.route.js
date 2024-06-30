"use strict";
/*
  "log" routes

  declares the endpoints related to fetching logs.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//import packages
const express_1 = __importDefault(require("express"));
const get_logs_controller_1 = require("../controllers/log-controllers/get-logs.controller");
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
//initialise express router
exports.router = express_1.default.Router();
exports.router.use(require_auth_middleware_1.authenticate);
//get logs route
exports.router.get('/', get_logs_controller_1.getLogs);
