import { LogData } from '../../lib/mongoose/log-model.mongoose';
import { ISession } from '../../types/express-session';
import { LogsCreateData } from '../../types/log';
import sendEmail from '../email-service/email.service';
import criticalErrorTemplate from '../email-service/templates/critical-error.template';
import createLogMongo from '../mongo-services/create-log-mongo.service';

const logCritical = async (data: LogsCreateData) => {
  const { req, res, error } = data;
  try {
    const newLogData: LogData = {
      logLevel: 'critical',
      timestamp: new Date(),
      responseTimeMS: res.locals.responseTimeMs || null,
      url: req.originalUrl,
      method: req.method,
      code: res.statusCode,
      ip: req.ip,
      userId: (req.session as ISession)?.user?.id || '--unknown--',
      message: error?.message || 'An unknown error occurred',
      detailedMessage: error?.detailedMessage || '--unknown--',
      headers: {
        userAgent: req.headers['user-agent'] || '--unknown--',
        referer: req.headers['referer'] || '--unknown--',
        contentType: req.headers['content-type'] || '--unknown--',
      },
      captchaResult: res.locals.captchaResult || null,
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

    if (req.body.captchaTokenV3) {
      newLogData.body.captchaTokenV3 = '--REDACTED--';
    }

    if (req.body.captchaTokenV2) {
      newLogData.body.captchaTokenV2 = '--REDACTED--';
    }

    if (error?.stack) {
      newLogData.stackTrace = error.stack || '--unknown--';
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
