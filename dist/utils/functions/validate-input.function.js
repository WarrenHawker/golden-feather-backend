"use strict";
/*
  "input validation" functions

  The following functions are used to validate various user inputs.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEndpoint = exports.isResCode = exports.isReqMethod = exports.isLogLevel = exports.isContentStatus = exports.isNumber = exports.isBoolean = exports.isUserStatus = exports.isUserRole = void 0;
//returns true if the input is a valid user role, else returns false
const isUserRole = (input) => {
    if (input == 'user' || input == 'moderator' || input == 'admin') {
        return true;
    }
    else
        return false;
};
exports.isUserRole = isUserRole;
//returns true if the input is a valid user status, else returns false
const isUserStatus = (input) => {
    if (input == 'inactive' ||
        input == 'active' ||
        input == 'muted' ||
        input == 'banned' ||
        input == 'deleted' ||
        input == 'locked') {
        return true;
    }
    else
        return false;
};
exports.isUserStatus = isUserStatus;
//returns true if the input is the string version of a boolean, else returns false
const isBoolean = (input) => {
    if (input == 'true' || input == 'false') {
        return true;
    }
    else
        return false;
};
exports.isBoolean = isBoolean;
//returns true if the input can be converted into a number, else returns false
const isNumber = (input) => {
    if (Number.isNaN(parseInt(input))) {
        return false;
    }
    else
        return true;
};
exports.isNumber = isNumber;
//returns true if the input is a valid content status, else returns false
const isContentStatus = (input) => {
    if (input == 'public' || input == 'private' || input == 'deleted') {
        return true;
    }
    else
        return false;
};
exports.isContentStatus = isContentStatus;
//returns true if the input is a valid log level, else returns false
const isLogLevel = (input) => {
    if (input == 'info' ||
        input == 'warn' ||
        input == 'error' ||
        input == 'critical') {
        return true;
    }
    else
        return false;
};
exports.isLogLevel = isLogLevel;
//returns true if the input is a valid request method, else returns false
const isReqMethod = (input) => {
    input = input.toUpperCase();
    if (input == 'GET' ||
        input == 'POST' ||
        input == 'PATCH' ||
        input == 'DELETE') {
        return true;
    }
    else
        return false;
};
exports.isReqMethod = isReqMethod;
//returns true if the input is a valid response code, else returns false
const isResCode = (input) => {
    const inputNum = parseInt(input);
    if (!isNaN(inputNum) &&
        (inputNum == 200 ||
            inputNum == 201 ||
            inputNum == 400 ||
            inputNum == 401 ||
            inputNum == 403 ||
            inputNum == 409 ||
            inputNum == 429 ||
            inputNum == 500)) {
        return true;
    }
    else
        return false;
};
exports.isResCode = isResCode;
//returns true if the input is a valid url, else returns false
//TODO change endpoints to be project specific
const isEndpoint = (input) => {
    if (input == 'user' ||
        input == 'entry' ||
        input == 'log' ||
        input == 'session' ||
        input == 'signin' ||
        input == 'signup' ||
        input == 'verify' ||
        input == 'resend_verify' ||
        input == 'reset_password') {
        return true;
    }
    else
        return false;
};
exports.isEndpoint = isEndpoint;
