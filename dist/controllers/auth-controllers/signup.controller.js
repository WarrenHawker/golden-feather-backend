"use strict";
/*
  "signup user" controller function

  registers a new user, using their chosen name, email and password.
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUser = void 0;
//import packages
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_prisma_1 = require("../../lib/prisma/client.prisma");
const logger_service_1 = require("../../services/logger.service");
const { isEmail, isEmpty, isStrongPassword, normalizeEmail, escape } = validator_1.default;
const signUpUser = async (req, res) => {
    //get name, email, password and repeatPassword from body params
    let { name, email, password, repeatPassword } = req.body;
    //check all params exist
    const missingParams = [];
    if (!name) {
        missingParams.push('name');
    }
    if (!email) {
        missingParams.push('email');
    }
    if (!password) {
        missingParams.push('password');
    }
    if (!repeatPassword) {
        missingParams.push('repeat password');
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
    if (isEmpty(name, { ignore_whitespace: true })) {
        emptyFields.push('name');
    }
    if (isEmpty(email, { ignore_whitespace: true })) {
        emptyFields.push('email');
    }
    if (isEmpty(password, { ignore_whitespace: true })) {
        emptyFields.push('password');
    }
    if (isEmpty(repeatPassword, { ignore_whitespace: true })) {
        emptyFields.push('repeat password');
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
    //check passwords match
    if (password != repeatPassword) {
        const error = {
            code: 400,
            message: 'Passwords do not match',
            params: ['password', 'repeatPassword'],
        };
        res.status(400).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //sanitise inputs
    name = escape(name).trim();
    email = escape(email).trim();
    email = normalizeEmail(email, { gmail_remove_dots: false });
    password = password.trim();
    repeatPassword = repeatPassword.trim();
    //check user with email doesn't already exist in database
    const user = await client_prisma_1.prismaClient.user.findUnique({ where: { email: email } });
    if (user) {
        const error = {
            code: 409,
            message: 'User with that email already exists',
            params: ['email'],
        };
        res.status(409).json(error);
        (0, logger_service_1.createLog)('error', req, res, error);
        return;
    }
    //hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUserData = {
        name: name,
        email: email,
        password: hashedPassword,
        created_on: new Date(),
        role: 'user',
        status: 'inactive',
    };
    //try creating user in database
    try {
        const newUser = await client_prisma_1.prismaClient.user.create({ data: newUserData });
        //user object sent to the client
        const user = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            status: newUser.status,
        };
        res.status(201).json(user);
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
exports.signUpUser = signUpUser;
