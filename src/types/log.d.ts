import { Request, Response } from 'express';

type LogLevel = 'info' | 'error' | 'critical';
type ReqMethod =
  | 'GET'
  | 'POST'
  | 'PATCH'
  | 'DELETE'
  | 'PUT'
  | 'HEAD'
  | 'OPTIONS';
type ResCode = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 502 | 503;

/*
  Log Levels
  
  info: POST, PATCH and DELETE request success
  error: 4** code errors
  critical: 500 code errors - send automated email to admins
*/

/* 
  Basic log data, used in all logs
  complete for successful GET requests (level: info)
*/
interface logDataBasic {
  logLevel: LogLevel = 'info';
  timestamp: string;
  responseTimeMS: number | null;
  url: string;
  method: ReqMethod;
  code: ResCode;
  headers: {
    userAgent: string;
  };
}

//404 errors from GET requests (level: info)
interface logDataGet404 extends logDataBasic {
  message: string;
  headers: {
    userAgent: string;
    referer: string | null;
  };
}

//successful POST, PATCH or DELETE requests (level: info)
interface logDataSuccess extends logDataBasic {
  body?: any;
  ip: string;
  headers: {
    userAgent: string;
    referer: string | null;
    contentType: string;
    authorization: 'present' | 'absent';
  };
  userId?: string;
}

//4xx errors from POST, PATCH or DELETE requests (level: error)
interface logDataError extends logDataSuccess {
  logLevel: LogLevel = 'error';
  message: string;
}

//5xx errors from any request (level: critical)
interface logDataCritical extends logDataError {
  logLevel: LogLevel = 'critical';
  stackTrace?: string;
}

type LogsCreateData = {
  req: Request;
  res: Response;
  error?: ErrorReturn;
};
