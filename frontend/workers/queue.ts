import { sharedRedisClient } from "@/lib/redis";
import { Queue } from "bullmq";

export const imageQueue = new Queue("image-conversion", {
    connection: sharedRedisClient as any,
    defaultJobOptions: {
        attempts: 1, 
        removeOnComplete: {
            age: 300,
            count: 60
        },
        removeOnFail: {
            age: 300
        }
    }
})