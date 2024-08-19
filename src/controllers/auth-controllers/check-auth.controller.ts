import { Request, Response } from 'express';

export const checkAuth = async (req: Request, res: Response) => {
  if (req.session) {
    res.status(200).json({ isAuthenticated: true });
  } else {
    res.status(200).json({ isAuthenticated: false });
  }
};
