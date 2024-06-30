"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activeEnvironment = void 0;
//import packages
const app_1 = require("./app");
const client_redis_1 = require("./lib/redis/client.redis");
const mongoose_1 = __importDefault(require("mongoose"));
//port and database variables - imported from .env file
const port = process.env.PORT || 5000;
const mongodb = process.env.MONGO_DB || 'mongodb://localhost:8080';
//start server
app_1.app.listen(port, async () => {
    await client_redis_1.redisClient.connect(); //opens connection to redis database
    await mongoose_1.default.connect(mongodb, {
        dbName: 'golden_feather_logs',
    });
    console.log(`server running on port ${port}, Is redis client connected? ${client_redis_1.redisClient.isOpen}`);
    console.log('environment: ', app_1.app.get('env'));
    exports.activeEnvironment = app_1.app.get('env');
});
