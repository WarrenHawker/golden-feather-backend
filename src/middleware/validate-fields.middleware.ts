import { NextFunction, Request, Response } from 'express';
import { isEmpty, isStrongPassword, normalizeEmail } from 'validator';
import { escape, isEmail } from 'validator';
import {
  isBoolean,
  isContentStatus,
  isPosNumber,
  isUserRole,
  isUserStatus,
  isValidCuid,
  isValidVideoUrl,
} from '../utils/functions/validate-input.function';
import sanitiseSocials from '../utils/functions/sanitise-socials.function';
import sanitiseArray from '../utils/functions/sanitise-array.function';
import trimExcerpt from '../utils/functions/trim-excerpt.function';
import { CustomError } from '../types/custom-error';

export type FieldType =
  | 'email'
  | 'password'
  | 'string'
  | 'id'
  | 'socials'
  | 'string array'
  | 'content status'
  | 'user status'
  | 'user role'
  | 'video url'
  | 'excerpt'
  | 'token'
  | 'number'
  | 'boolean';

export type RequiredField = {
  name: string;
  type: FieldType;
  optional: boolean;
  paramType: 'body' | 'query';
};

const validateFields = (requiredFields: RequiredField[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const missingOrEmptyFields: string[] = [];

      for (const field of requiredFields) {
        if (field.optional) {
          continue;
        }

        const value =
          field.paramType == 'body'
            ? req.body[field.name]
            : req.query[field.name];

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
          missingOrEmptyFields.push(field.name);
        }
      }

      if (missingOrEmptyFields.length > 0) {
        return res.status(400).json({
          code: 400,
          message: 'Missing or empty required body parameters',
          params: missingOrEmptyFields,
        });
      }

      for (const field of requiredFields) {
        const value =
          field.paramType == 'body'
            ? req.body[field.name]
            : req.query[field.name];
        const param = field.paramType;

        if (field.optional && value === undefined) {
          continue;
        }

        switch (field.type) {
          case 'email':
            if (!isEmail(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            req[param][field.name] = normalizeEmail(value, {
              gmail_remove_dots: false,
            });
            break;
          case 'password':
            if (!isStrongPassword(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            req[param][field.name] = value.trim();
            break;
          case 'string':
            req[param][field.name] = escape(value).trim();
            break;
          case 'id':
            if (!isValidCuid(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'socials':
            req[param][field.name] = sanitiseSocials(value);
            break;
          case 'string array':
            const arrValue = Array.isArray(value) ? value : [value];
            req[param][field.name] = sanitiseArray(arrValue);
            break;
          case 'content status':
            if (!isContentStatus(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'user status':
            if (!isUserStatus(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'user role':
            if (!isUserRole(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'video url':
            if (!isValidVideoUrl(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'excerpt':
            req[param][field.name] = trimExcerpt(value).trim();
            break;
          case 'token':
            break;
          case 'number':
            if (!isPosNumber(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
            break;
          case 'boolean':
            if (!isBoolean(value)) {
              return next(new CustomError(`Invalid ${field.name}`, 400));
            }
          default:
            break;
        }
      }
    } catch (err) {
      next(err);
    }
    next();
  };
};

export default validateFields;
