import { conversionImageWorker } from "./conversion.worker";

console.log("🚀 Worker Started");

const worker = conversionImageWorker();
//   This prints a clean, lightweight performance summary
worker.on('completed', (job, returnvalue) => {
  console.log(`\x1b[32m✓ [Job ${job.id}] Success!\x1b[0m`);
  console.log(`  File: ${returnvalue.name}`);
  console.log(`  Target Size: ${(returnvalue.size / 1024).toFixed(2)} KB`);
});

worker.on('failed', (job, err) => {
  console.error(`\x1b[31m✕ [Job ${job?.id}] Failed:\x1b[0m`, err.message);
});