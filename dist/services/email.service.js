"use strict";
/*
  "automated email" service

  Uses sendgrid to send automated emails to users.
  For more information, go to https://docs.sendgrid.com/
*/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
//import packages
const mail_1 = __importDefault(require("@sendgrid/mail"));
require("dotenv/config");
const sendEmail = async (recipient, subject, text, html) => {
    //validates environment variables from .env file
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromAddress = process.env.SENDGRID_SENDER;
    if (!apiKey) {
        throw new Error('valid API key not found');
    }
    if (!fromAddress) {
        throw new Error('invalid fromAddress');
    }
    mail_1.default.setApiKey(apiKey);
    //send email to user
    const email = {
        to: recipient,
        from: fromAddress,
        subject: subject,
        text: text,
        html: html,
    };
    try {
        await mail_1.default.send(email);
        return email;
    }
    catch (error) {
        throw new Error(error);
    }
};
exports.sendEmail = sendEmail;
