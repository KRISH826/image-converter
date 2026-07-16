import { conversionImageWorker } from "./conversion.worker";

console.log("🚀 Worker Started");

const worker = conversionImageWorker();
//   This prints a clean, lightweight performance summary
worker.on('completed', (job, returnvalue) => {
  if (job.data?.type === 'cleanup') {
    console.log(`\x1b[32m✓ [Job ${job.id}] Cleanup complete\x1b[0m`);
    return;
  }

  console.log(`\x1b[32m✓ [Job ${job.id}] Success!\x1b[0m`);
  console.log(`  File: ${returnvalue?.name ?? 'unknown'}`);
  console.log(`  Target Size: ${typeof returnvalue?.size === 'number' ? (returnvalue.size / 1024).toFixed(2) : 'unknown'} KB`);
});

worker.on('failed', (job, err) => {
  console.error(`\x1b[31m✕ [Job ${job?.id}] Failed:\x1b[0m`, err.message);
});
