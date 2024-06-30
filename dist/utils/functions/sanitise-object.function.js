"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitiseObject = void 0;
const validator_1 = __importDefault(require("validator"));
const { isURL } = validator_1.default;
const sanitiseObject = (obj) => {
    const newObj = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            if (typeof value === 'string') {
                if (isURL(newObj[key])) {
                    newObj[key] = value.trim();
                }
                else {
                    newObj[key] = '';
                }
            }
            else {
                newObj[key] = value;
            }
        }
    }
    return newObj;
};
exports.sanitiseObject = sanitiseObject;
