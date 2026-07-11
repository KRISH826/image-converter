import { conversionImageWorker } from "./conversion.worker";

console.log("🚀 Worker Started");

const worker = conversionImageWorker();
worker.on("completed", (job) => {
    console.log("Job completed", job);
})

worker.on("failed", (job) => {
    console.log("Job failed", job);
})