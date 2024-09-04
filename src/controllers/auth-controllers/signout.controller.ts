import { Request, Response } from 'express';

export const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error signing out');
    }

    res.clearCookie('sessionId');
    res.send('Logout successful');
  });
};
