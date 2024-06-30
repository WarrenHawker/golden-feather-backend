"use strict";
/*
  "signin user" controller function

  Signs the user in using their email and password.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signInUser = void 0;
//import packages
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const logger_service_1 = require("../../services/logger.service");
const { isEmail, isEmpty, isStrongPassword, normalizeEmail, escape } = validator_1.default;
const signInUser = async (req, res) => {
    //get email and password from body params
    let { email, password } = req.body;
    //check all params exist
    const missingParams = [];
    if (!email) {
        missingParams.push('email');
    }
    if (!password) {
        missingParams.push('password');
    }
    if (missingParams.length > 0) {
        const error = {
            code: 400,
            message: 'Missing body parameters',
            params: missingParams,
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //check empty fields
    const emptyFields = [];
    if (isEmpty(email, { ignore_whitespace: true })) {
        emptyFields.push('email');
    }
    if (isEmpty(password, { ignore_whitespace: true })) {
        emptyFields.push('password');
    }
    if (emptyFields.length > 0) {
        const error = {
            code: 400,
            message: 'Empty input fields',
            params: emptyFields,
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //check email is valid
    if (!isEmail(email)) {
        const error = {
            code: 400,
            message: 'Invalid email',
            params: ['email'],
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //check password is valid
    if (!isStrongPassword(password)) {
        const error = {
            code: 400,
            message: 'Password not strong enough',
            params: ['password'],
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //sanitise inputs
    email = escape(email).trim();
    email = normalizeEmail(email, { gmail_remove_dots: false });
    password = password.trim();
    //check if user exists in database
    const userDB = await client_prisma_1.prismaClient.user.findUnique({
        where: { email: email },
    });
    if (!userDB) {
        const error = {
            code: 404,
            message: 'User not found',
            params: ['email'],
        };
        res.status(404).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //check password is correct
    const match = await bcrypt_1.default.compare(password, userDB.password);
    if (!match) {
        const error = {
            code: 400,
            message: 'Wrong password',
            params: ['password'],
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //create session and store in Redis
    try {
        req.session.role = userDB.role;
        req.session.status = userDB.status;
        req.session.email = userDB.email;
        //user object to be sent to client
        const user = {
            id: userDB.id,
            name: userDB.name,
            email: userDB.email,
            role: userDB.role,
            status: userDB.status,
        };
        res.status(200).json(user);
        (0, logger_service_1.createLog)('info', req, res);
        return;
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
exports.signInUser = signInUser;
