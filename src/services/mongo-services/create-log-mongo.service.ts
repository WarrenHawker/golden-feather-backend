import moment from 'moment';
import {
  getLogModelForMonth,
  LogData,
} from '../../lib/mongoose/log-model.mongoose';

const createLogMongo = async (data: LogData) => {
  try {
    const currentYear = moment().format('YYYY');
    const currentMonth = moment().format('MM');

    const collectionName = `logs_${currentYear}_${currentMonth}_${data.logLevel}`;

    const LogModel = await getLogModelForMonth(collectionName);

    const newLog = new LogModel(data);
    await newLog.save();
  } catch (error) {
    console.error(`Error saving log:`, error);
    throw error;
  }
};

export default createLogMongo;
