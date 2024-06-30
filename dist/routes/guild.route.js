"use strict";
/*
  "guild" routes

  declares the endpoints for guild CRUD operations.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//import packages
const express_1 = __importDefault(require("express"));
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
const delete_guild_controller_1 = require("../controllers/guild-controllers/delete-guild.controller");
const create_guild_controller_1 = require("../controllers/guild-controllers/create-guild.controller");
const update_guild_controller_1 = require("../controllers/guild-controllers/update-guild.controller");
const get_guilds_controller_1 = require("../controllers/guild-controllers/get-guilds.controller");
//initialise express router
exports.router = express_1.default.Router();
exports.router.get('/', get_guilds_controller_1.getGuilds);
/*
  all routes that come after this middleware are protected.
  can only be access if the user is logged in and has the correct role and status.
*/
exports.router.use(require_auth_middleware_1.authenticate);
exports.router.post('/', create_guild_controller_1.createGuild);
exports.router.patch('/:id', update_guild_controller_1.updateGuild);
exports.router.delete('/:id', delete_guild_controller_1.deleteGuild);
