import { ConnectionOptions } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const isLocal = process.env.REDIS_HOST === 'localhost' || process.env.REDIS_HOST === '127.0.0.1';

export const redisConnection: ConnectionOptions = {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    // No TLS needed — self-hosted Redis on EC2, plain TCP over localhost
    maxRetriesPerRequest: null,
    connectTimeout: 10000,
};

// Create a reusable shared IORedis client instance
export const sharedRedisClient = new IORedis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
});