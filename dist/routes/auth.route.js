"use strict";
/*
  "authentication" routes

  declares the endpoints related to user authentication.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
//import packages
const express_1 = __importDefault(require("express"));
const require_auth_middleware_1 = require("../middleware/require-auth.middleware");
const signin_controller_1 = require("../controllers/auth-controllers/signin.controller");
const signup_controller_1 = require("../controllers/auth-controllers/signup.controller");
//initialise express router
exports.router = express_1.default.Router();
//sign in route
exports.router.post('/signin', signin_controller_1.signInUser);
/*
all routes that come after this middleware are protected.
can only be access if the user is logged in and has the correct role and status.
*/
exports.router.use(require_auth_middleware_1.authenticate);
exports.router.post('/signup', signup_controller_1.signUpUser);
