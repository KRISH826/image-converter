import { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';

export const redisConnection: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    // Upstash requires TLS encryption over the web
    tls: {}, 
    // Crucial for serverless environments to prevent stalling connections
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
};

// Create a reusable shared IORedis client instance to stay well under Upstash connection limits
export const sharedRedisClient = new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    tls: {},
    maxRetriesPerRequest: null,
});