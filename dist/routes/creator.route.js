"use strict";
/*
  "content creator" routes

  declares the endpoints for content creator CRUD operations.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//import packages
const express_1 = __importDefault(require("express"));
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
const create_creator_controller_1 = require("../controllers/content-creator-controllers/create-creator.controller");
const delete_creator_controller_1 = require("../controllers/content-creator-controllers/delete-creator.controller");
const update_creator_controller_1 = require("../controllers/content-creator-controllers/update-creator.controller");
const get_creator_controller_1 = require("../controllers/content-creator-controllers/get-creator.controller");
//initialise express router
exports.router = express_1.default.Router();
exports.router.get('/', get_creator_controller_1.getCreators);
/*
all routes that come after this middleware are protected.
can only be access if the user is logged in and has the correct role and status.
*/
exports.router.use(require_auth_middleware_1.authenticate);
exports.router.post('/', create_creator_controller_1.createCreator);
exports.router.patch('/:id', update_creator_controller_1.updateCreator);
exports.router.delete('/', delete_creator_controller_1.deleteCreator);
