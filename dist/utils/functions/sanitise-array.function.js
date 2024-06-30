"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitiseArray = void 0;
const validator_1 = __importDefault(require("validator"));
const { escape } = validator_1.default;
const sanitiseArray = (array) => {
    if (array.length < 1) {
        return [];
    }
    else {
        return array.map((item) => escape(item).trim());
    }
};
exports.sanitiseArray = sanitiseArray;
