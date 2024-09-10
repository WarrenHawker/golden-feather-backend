import { LogData } from '../../lib/mongoose/log-model.mongoose';
import { ISession } from '../../types/express-session';
import { LogsCreateData } from '../../types/log';
import criticalErrorTemplate from '../../utils/templates/critical-error.template';
import sendEmail from '../email.service';
import createLogMongo from '../mongo-services/create-log-mongo.service';

const logCritical = async (data: LogsCreateData) => {
  const { req, res, error } = data;
  try {
    const newLogData: LogData = {
      logLevel: 'critical',
      timestamp: new Date().toISOString(),
      responseTimeMS: req.responseTimeMs ?? null,
      url: req.originalUrl,
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

    if (error?.stack) {
      newLogData.stackTrace = error.stack || '';
    }

    await createLogMongo(newLogData);
    const { text, html } = criticalErrorTemplate(newLogData);
    const to = process.env.ADMIN_EMAIL || '';
    await sendEmail(to, 'CRITICAL ERROR', text, html);
  } catch (error) {
    throw error;
  }
};

export default logCritical;
