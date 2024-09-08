import express from 'express';
import rateLimiter from '../../middleware/rate-limiter.middleware';

export const router = express.Router();

router.use(rateLimiter(3, 60, 'csrf'));

router.get('/', (req, res) => {
  try {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // Token expires in 1 day
      path: '/',
    });
    res.sendStatus(200);
  } catch (err) {
    const error: ErrorReturn = {
      code: 500,
      message: (err as Error).message,
    };
    return res.status(500).json(error);
  }
});
