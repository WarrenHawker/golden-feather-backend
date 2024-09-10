import { LogData } from '../../lib/mongoose/log-model.mongoose';
import { ISession } from '../../types/express-session';
import { LogsCreateData } from '../../types/log';
import createLogMongo from '../mongo-services/create-log-mongo.service';

const logError = async (data: LogsCreateData) => {
  const { req, res, error } = data;
  try {
    const newLogData: LogData = {
      logLevel: 'error',
      timestamp: new Date().toISOString(),
      responseTimeMS: req.responseTimeMs ?? null,
      url: req.url,
      method: req.method,
      code: res.statusCode,
      ip: req.ip,
      userId: (req.session as ISession)?.user?.id || '',
      message: error?.message || 'An unknown error occurred',
      headers: {
        userAgent: req.headers['user-agent'] || '',
        referer: req.headers['referer'] || '',
        contentType: req.headers['content-type'] || '',
      },
    };

    if (req.headers['authorization']) {
      newLogData.headers.authorization = 'present';
    } else {
      newLogData.headers.authorization = 'absent';
    }

    newLogData.body = req.body;
    if (req.body.password) {
      newLogData.body.password = '--REDACTED--';
    }
    if (req.body.repeatPassword) {
      newLogData.body.repeatPassword = '--REDACTED--';
    }

    await createLogMongo(newLogData);
  } catch (error) {
    throw error;
  }
};

export default logError;
