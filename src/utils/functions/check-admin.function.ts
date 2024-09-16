import { Request } from 'express';
import { ISession } from '../../types/express-session';

const checkActiveAdmin = (req: Request) => {
  const session = req.session as ISession;

  if (!session) {
    return false;
  }

  const user = (req.session as ISession).user;
  if (!user) {
    return false;
  }

  const role = user.role || null;
  if (!role) {
    return false;
  }

  const status = user.status || null;
  if (!status) {
    return false;
  }

  if (role == 'admin' && status == 'active') {
    return true;
  } else return false;
};

export default checkActiveAdmin;
