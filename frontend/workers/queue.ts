import { sharedRedisClient } from "@/lib/redis";
import { Queue } from "bullmq";

export const imageQueue = new Queue("image-conversion", {
    // cast to any to avoid type mismatch between multiple ioredis versions
    connection: sharedRedisClient as any,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: "exponential",
            delay: 1500,
        },
        removeOnComplete:{
            age: 1800,
            count: 100
        },
        removeOnFail: {
            age: 86400
        }
    }
})