/**
 * @file send-email.service.ts
 * @description Service function for sending emails using the SendGrid API. This function utilizes the SendGrid
 *              Node.js library to send an email to a specified recipient. The function requires an API key and a
 *              sender address, both of which are retrieved from environment variables. If either is missing, an
 *              error is thrown. The function supports plain text and HTML email content.
 *
 * @module services/email
 *
 * @function sendEmail - Asynchronous function to send an email using SendGrid. It constructs an email object with the
 *                       recipient, subject, text, and HTML content, and sends it via the SendGrid API.
 *
 * @param {string} recipient - The email address of the recipient.
 * @param {string} subject - The subject line of the email.
 * @param {string} text - The plain text content of the email.
 * @param {string} html - The HTML content of the email.
 *
 * @returns {Promise<object>} - A promise that resolves with the email object if the email is successfully sent.
 *
 * @throws {Error} - Throws an error if the API key or sender address is missing, or if there is an issue with sending the email.
 *
 * @requires @sendgrid/mail - SendGrid's official Node.js library for sending emails.
 * @requires dotenv/config - Loads environment variables from a `.env` file into `process.env`.
 */

import sgMail from '@sendgrid/mail';
import 'dotenv/config';

export const sendEmail = async (
  recipient: string,
  subject: string,
  text: string,
  html: string
) => {
  const apiKey = process.env.SENDGRID_API_KEY;
  const fromAddress = process.env.SENDGRID_SENDER;
  if (!apiKey) {
    throw new Error('valid API key not found');
  }
  if (!fromAddress) {
    throw new Error('invalid fromAddress');
  }
  sgMail.setApiKey(apiKey);

  const email = {
    to: recipient,
    from: fromAddress,
    subject: subject,
    text: text,
    html: html,
  };
  try {
    await sgMail.send(email);
    return email;
  } catch (error) {
    throw new Error(error as string);
  }
};
