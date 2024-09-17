import { LogData } from '../../lib/mongoose/log-model.mongoose';
import { LogReport } from '../../types/log-report';
import {
  replaceUrlSlug,
  arrayContainsName,
  calculateStatistics,
  getMonthsBetweenDates,
} from '../../utils/functions/log-report-utils.function';
import getLogsMongo from '../mongo-services/get-logs-mongo.service';

const createLogsReport = async (start: Date, end: Date, threshold: number) => {
  const data: LogReport = {
    startDate: start,
    endDate: end,
    totalRequests: 0,
    logTypes: {
      info: 0,
      error: 0,
      critical: 0,
    },
    responseTimes: {
      slowest: null,
      fastest: null,
      average: null,
      median: null,
      percentile90: null,
      percentile95: null,
      percentile99: null,
    },
    slowRequests: {
      threshholdMS: threshold,
      count: 0,
    },
    endpoints: [],
  };
  const responseTimes: number[] = [];

  const months = getMonthsBetweenDates(start, end);

  const logs: LogData[] = await getLogsMongo();

  logs.forEach((log) => {
    //add log responseTime to array if it isn't null
    if (typeof log.responseTimeMS == 'number') {
      responseTimes.push(log.responseTimeMS);
    }
    data.totalRequests++;

    //add to logTypes based on loglevel
    switch (log.logLevel) {
      case 'info':
        data.logTypes.info++;
        break;
      case 'error':
        data.logTypes.error++;
        break;
      case 'critical':
        data.logTypes.critical++;
        break;
      default:
        break;
    }

    //if response time is above threshold, add to slow requests
    if (log.responseTimeMS && log.responseTimeMS >= threshold) {
      data.slowRequests.count++;
    }

    let endpoint = log.url;
    //if endpoint starts with /api/v1/creator/ or /api/v1/guild/, replace the slug name with "slug"
    if (/^\/api\/v1\/creator\/[^/]+$/.test(endpoint)) {
      endpoint = replaceUrlSlug(endpoint, 'creator');
    } else if (/^\/api\/v1\/guild\/[^/]+$/.test(endpoint)) {
      endpoint = replaceUrlSlug(endpoint, 'guild');
    }
    const index = arrayContainsName(data.endpoints, endpoint);

    //if endpoint name already exists in data, increment that count, otherwise create new endpoint in data
    if (index == null) {
      //endpoint doesn't exist in array yet, so create new entry
      data.endpoints.push({
        name: endpoint,
        totalRequests: 1,
        slowRequests:
          log.responseTimeMS && log.responseTimeMS > threshold ? 1 : 0,
        totalInfo: log.logLevel == 'info' ? 1 : 0,
        totalError: log.logLevel == 'error' ? 1 : 0,
        totalCritical: log.logLevel == 'critical' ? 1 : 0,
      });
    } else {
      //endpoint already exists, so add to endpoint data
      data.endpoints[index].totalRequests++;
      switch (log.logLevel) {
        case 'info':
          data.endpoints[index].totalInfo++;
          break;
        case 'error':
          data.endpoints[index].totalError++;
          break;
        case 'critical':
          data.endpoints[index].totalCritical++;
          break;
        default:
          break;
      }

      if (log.responseTimeMS && log.responseTimeMS > threshold) {
        data.endpoints[index].slowRequests++;
      }
    }
  });

  //use gathered responseTimes to calculate time stats
  data.responseTimes = calculateStatistics(responseTimes);

  return data;
};

export default createLogsReport;
