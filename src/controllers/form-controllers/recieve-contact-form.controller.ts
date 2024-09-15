//TODO save contact form in mongodb

import { NextFunction, Request, Response } from 'express';
import sendEmail from '../../services/email-service/email.service';
import {
  contactFormUserTemplate,
  contactFormAdminTemplate,
} from '../../services/email-service/templates/contact-form.template';
import { CustomError } from '../../types/custom-error';
import responseHandler from '../../middleware/response-handler.middleware';

const receiveContactForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, message } = req.body;

  try {
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

    return responseHandler(req, res, 200);
  } catch (error) {
    const statusCode = (error as any).statusCode || 500;
    const detailedMessage = (error as any).message || 'Unknown error occurred';
    return next(
      new CustomError(
        'An unexpected error occurred. Please try again later.',
        statusCode,
        detailedMessage
      )
    );
  }
};

export default receiveContactForm;
