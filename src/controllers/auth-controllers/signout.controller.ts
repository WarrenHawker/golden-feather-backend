import { Request, Response } from 'express';

const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send('Error signing out');
    }

    res.clearCookie('sessionId');
    res.send('Logout successful');
  });
};

export default signoutUser;
