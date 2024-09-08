import { Request, Response } from 'express';

const signoutUser = async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      const error: ErrorReturn = {
        code: 500,
        message: (err as Error).message,
      };
      return res.status(500).json(error);
    }

    res.clearCookie('sessionId');
    return res.sendStatus(200);
  });
};

export default signoutUser;
