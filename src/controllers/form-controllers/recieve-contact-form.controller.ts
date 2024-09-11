//TODO save contact form in mongodb

import { Request, Response } from 'express';
import { ErrorReturn } from '../../types/error-return';
import axios from 'axios';
import { isEmail, escape, normalizeEmail } from 'validator';
import sendEmail from '../../services/email.service';
import {
  contactFormAdminTemplate,
  contactFormUserTemplate,
} from '../../utils/templates/contact-form.template';

const receiveContactForm = async (req: Request, res: Response) => {
  let { name, email, message } = req.body;

  try {
    if (!isEmail(email)) {
      const error: ErrorReturn = {
        code: 400,
        message: 'Invalid email',
        params: ['email'],
      };
      return res.status(error.code).json(error);
    }

    email = escape(email).trim();
    email = normalizeEmail(email, { gmail_remove_dots: false });
    name = escape(name).trim();
    message = escape(message).trim();

    const { text: textUser, html: htmlUser } = contactFormUserTemplate(
      name,
      email,
      message
    );
    const { text: textAdmin, html: htmlAdmin } = contactFormAdminTemplate(
      name,
      email,
      message
    );

    await sendEmail(
      process.env.ADMIN_EMAIL || '',
      'New Contact Form Submission',
      textAdmin,
      htmlAdmin
    );
    await sendEmail(email, 'Thank You for Contacting Us', textUser, htmlUser);

    return res.status(200).json(req.body);
  } catch (err) {
    const error: ErrorReturn = {
      code: (err as any).statusCode || (err as any).status || 500,
      message: (err as Error).message,
      stack: (err as Error).stack,
    };
    return res.status(error.code).json(error);
  }
};

export default receiveContactForm;
