import crypto from "crypto";
import ProductImport from "../models/ProductImport";
import { processProductImport } from "../services/productImportService";

const POLL_INTERVAL_MS = 2000;
const STALE_JOB_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;

let workerRunning = false;

const generateJobId = (): string => {
  return `product-import-${crypto.randomUUID()}`;
};

const recoverStaleJobs = async (): Promise<void> => {
  const staleBefore = new Date(Date.now() - STALE_JOB_TIMEOUT_MS);

  const result = await ProductImport.updateMany(
    {
      status: "processing",
      processingStartedAt: {
        $lt: staleBefore,
      },
      attempts: {
        $lt: MAX_ATTEMPTS,
      },
    },
    {
      $set: {
        status: "uploaded",
        processingStartedAt: undefined,
      },
    },
  );

  if (result.modifiedCount > 0) {
    console.log(
      `[ProductImportWorker] Recovered ${result.modifiedCount} stale job(s)`,
    );
  }
};

const claimNextJob = async () => {
  const jobId = generateJobId();
  const now = new Date();

  const job = await ProductImport.findOneAndUpdate(
    {
      status: "uploaded",
      $or: [
        {
          attempts: {
            $lt: MAX_ATTEMPTS,
          },
        },
        {
          attempts: {
            $exists: false,
          },
        },
      ],
    },
    {
      $set: {
        status: "processing",
        jobId,
        processingStartedAt: now,
        startedAt: now,
      },
      $inc: {
        attempts: 1,
      },
    },
    {
      sort: {
        createdAt: 1,
      },
      returnDocument: "after",
    },
  );

  return job;
};

const processJob = async (
  productImportId: string,
  jobId: string,
): Promise<void> => {
  console.log(
    `[ProductImportWorker] Starting job ${jobId} for import ${productImportId}`,
  );

  try {
    await processProductImport(productImportId);

    console.log(`[ProductImportWorker] Job ${jobId} completed successfully`);
  } catch (error) {
    console.error(`[ProductImportWorker] Job ${jobId} failed:`, error);

    const productImport = await ProductImport.findById(productImportId);

    if (!productImport) {
      return;
    }

    if (productImport.attempts && productImport.attempts < MAX_ATTEMPTS) {
      await ProductImport.findByIdAndUpdate(productImportId, {
        $set: {
          status: "uploaded",
          processingStartedAt: undefined,
        },
      });

      console.log(`[ProductImportWorker] Job ${jobId} will be retried`);
    } else {
      await ProductImport.findByIdAndUpdate(productImportId, {
        $set: {
          status: "failed",
          completedAt: new Date(),
        },
      });

      console.error(`[ProductImportWorker] Job ${jobId} permanently failed`);
    }
  }
};

const workerLoop = async (): Promise<void> => {
  if (workerRunning) {
    return;
  }

  workerRunning = true;

  console.log("[ProductImportWorker] Worker started");

  while (workerRunning) {
    try {
      await recoverStaleJobs();

      const job = await claimNextJob();

      if (!job) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

        continue;
      }

      await processJob(job._id.toString(), job.jobId!);
    } catch (error) {
      console.error("[ProductImportWorker] Worker loop error:", error);

      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }
};

export const startProductImportWorker = (): void => {
  void workerLoop();
};

export const stopProductImportWorker = (): void => {
  workerRunning = false;
};
