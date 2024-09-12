import express from 'express';

declare global {
  namespace Express {
    interface Request {
      session?: Record<string, any>;
      responseTimeMs?: number;
      recaptchaScore?: number;
    }
  }
}
