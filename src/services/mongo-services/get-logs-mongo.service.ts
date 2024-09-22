//TODO fill in function

import { getLogModelForMonth } from '../../lib/mongoose/log-model.mongoose';
import { LogSearchParams } from '../../types/log';

const getLogsMongo = async (options: LogSearchParams = {}) => {
  const LogModel1 = await getLogModelForMonth('logs_2024_09_info');
  const LogModel2 = await getLogModelForMonth('logs_2024_09_error');

  const infoLogs = await LogModel1.find();
  const errorLogs = await LogModel2.find();

  return [...infoLogs, ...errorLogs];
};

export default getLogsMongo;
