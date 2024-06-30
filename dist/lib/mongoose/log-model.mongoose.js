"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const { Schema } = mongoose_1.default;
const logRequestDataSchema = new Schema({
    url: { type: String, required: true },
    method: {
        type: String,
        enum: ['GET', 'POST', 'PATCH', 'DELETE'],
        required: true,
    },
    ip: { type: String, required: true },
    body: { type: Object },
    headers: { type: Object },
}, { _id: false });
const logSchema = new Schema({
    level: {
        type: String,
        required: true,
        enum: ['info', 'warn', 'error', 'critical'],
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: Date,
        required: true,
    },
    responseCode: {
        type: Number,
        required: true,
    },
    request: {
        type: logRequestDataSchema,
        required: true,
    },
}, { versionKey: false });
logSchema.plugin(mongoose_paginate_v2_1.default);
exports.Log = (0, mongoose_1.model)('Log', logSchema, 'logs');
