import { LogReportEndpoint } from '../../types/log-report';

export const calculateStatistics = (arr: number[]) => {
  if (arr.length === 0) {
    throw new Error('Array is empty');
  }

  // Sort the array to compute percentiles and median
  const sorted = [...arr].sort((a, b) => a - b);

  // Helper function to calculate percentile
  const getPercentile = (percentile: number): number => {
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[Math.min(index, sorted.length - 1)];
  };

  // Calculate the lowest and highest
  const slowest = sorted[sorted.length - 1];
  const fastest = sorted[0];

  // Calculate the average
  const sum = arr.reduce((acc, val) => acc + val, 0);
  const average = sum / arr.length;

  // Calculate the median
  const median =
    sorted.length % 2 === 0
      ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
      : sorted[Math.floor(sorted.length / 2)];

  // Calculate percentiles
  const percentile90 = getPercentile(90);
  const percentile95 = getPercentile(95);
  const percentile99 = getPercentile(99);

  return {
    slowest,
    fastest,
    average,
    median,
    percentile90,
    percentile95,
    percentile99,
  };
};

export const arrayContainsName = (arr: LogReportEndpoint[], str: string) => {
  //look for a matching name inside the endpoints array.
  //If a match is found, return the index, else return null
  const index = arr.findIndex((item) => item.name === str);

  return index !== -1 ? index : null;
};

export const replaceUrlSlug = (url: string, str: string) => {
  const index = url.indexOf(`/${str}`);

  // If the url has the str inside it, remove everything after str and replace it with /slug
  if (index !== -1) {
    const sub = url.substring(0, index + `/${str}`.length);
    return `${sub}/slug`;
  }

  //if the url doesn't have str inside it, return the original url
  return url;
};

export const getMonthsBetweenDates = (
  startDate: Date,
  endDate: Date
): string[] => {
  const months: string[] = [];

  // Normalize the start and end dates to the first of their respective months
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  // Loop from the start date to the end date, month by month
  let current = new Date(start);

  while (current <= end) {
    // Format the current month as "YYYY-MM"
    const month = `${current.getFullYear()}_${(current.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
    months.push(month);

    // Move to the next month
    current.setMonth(current.getMonth() + 1);
  }

  return months;
};
