import { NextFunction, Request, Response } from 'express';
import { isEmpty } from 'validator';

const validateFields = (requiredFields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingOrEmptyFields: string[] = [];

    requiredFields.forEach((field) => {
      const value = req.body[field];

      if (
        value === undefined ||
        (typeof value === 'string' &&
          isEmpty(value, { ignore_whitespace: true })) ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          Object.keys(value).length === 0)
      ) {
        missingOrEmptyFields.push(field);
      }
    });

    if (missingOrEmptyFields.length > 0) {
      return res.status(400).json({
        code: 400,
        message: 'Missing or empty required body parameters',
        params: missingOrEmptyFields,
      });
    }

    next();
  };
};

export default validateFields;
