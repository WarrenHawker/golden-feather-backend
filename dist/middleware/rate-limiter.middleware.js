"use strict";
/*
  "rate limiter" middleware

  All endpoints are rate limited to 10 requests per IP address per 60 seconds.
  If the limit is reached, any subsequent requests will return a 429 ("too many requests") error.

  the signin user endpoint is rate limited to 3 requests per email.
  If the limit is reached, the account status will be changed to "locked" and cannot be unlocked
  until the user has re-verified their email and changed their password.
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.signinRateLimiter = exports.rateLimiter = void 0;
const client_redis_1 = require("../lib/redis/client.redis");
const logger_service_1 = require("../services/logger.service");
const rateLimiter = async (req, res, next) => {
    //get IP address of device making the request
    const ip = req.socket.remoteAddress;
    if (ip) {
        //if there's a valid ip address, update total number of request attempts and check if the limit has been reached
        const response = await client_redis_1.redisClient.multi().incr(ip).expire(ip, 60).exec();
        if (response[0] > 100) {
            //TODO change limit to 10 for production
            const error = {
                code: 429,
                message: 'Too many requests',
            };
            res.status(429).json(error);
            (0, logger_service_1.createLog)('error', req, res, error);
            return;
        }
    }
    else
        throw new Error('ip address not found');
    next();
};
exports.rateLimiter = rateLimiter;
const signinRateLimiter = async (req, res, next) => {
    const ip = req.socket.remoteAddress;
    const { email } = req.body;
    if (!ip) {
        return res.status(400).json({ error: 'IP address not found' });
    }
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    const key = `signin:${ip}:${email}`;
    try {
        const response = await client_redis_1.redisClient
            .multi()
            .incr(key)
            .expire(key, 60) // Expire key after 60 seconds
            .exec();
        // Type assertion to tell TypeScript what to expect
        const incrResult = response[0];
        const requestCount = incrResult[1];
        if (requestCount > 3) {
            return res.status(429).json({ error: 'Too many requests' });
        }
        next();
    }
    catch (err) {
        const error = {
            code: 500,
            message: err.message,
        };
        res.status(500).json(error);
        (0, logger_service_1.createLog)('critical', req, res, error);
        return;
    }
};
exports.signinRateLimiter = signinRateLimiter;
