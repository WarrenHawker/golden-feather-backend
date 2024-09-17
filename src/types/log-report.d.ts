export type LogReportEndpoint = {
  name: string;
  totalRequests: number;
  slowRequests: number;
  totalInfo: number;
  totalError: number;
  totalCritical: number;
};

export type LogReport = {
  startDate: Date | string;
  endDate: Date | string;
  totalRequests: number;
  logTypes: {
    info: number;
    error: number;
    critical: number;
  };
  responseTimes: {
    slowest: number | null;
    fastest: number | null;
    average: number | null;
    median: number | null;
    percentile90: number | null;
    percentile95: number | null;
    percentile99: number | null;
  };
  slowRequests: {
    threshholdMS: number;
    count: number;
  };
  endpoints: LogReportEndpoint[];
};
