import ProductImport from "../models/ProductImport";
import { processProductImport } from "../services/productImport/productImportService";

let workerRunning = false;
let processingJob = false;
let timer: NodeJS.Timeout | null = null;

const POLL_INTERVAL_MS = 3000;

// ============================================================
// PROCESS NEXT JOB
// ============================================================

async function processNextProductImport(): Promise<void> {
  if (processingJob) {
    return;
  }

  processingJob = true;

  try {
    // Atomically claim one waiting upload.
    const job = await ProductImport.findOneAndUpdate(
      {
        status: "uploaded",
        processingStage: "waiting",
        workerScope: process.env.PRODUCT_IMPORT_WORKER_SCOPE || "local",
      },
      {
        $set: {
          status: "processing",
          processingStage: "worker_claimed",
          startedAt: new Date(),
          processingStartedAt: new Date(),
          failureReason: null,
        },
        $inc: {
          attempts: 1,
        },
      },
      {
        returnDocument: "after",
        sort: {
          createdAt: 1,
        },
      },
    );

    if (!job) {
      return;
    }

    console.log(
      `[ProductImportWorker][NEW] CLAIMED id=${job._id} attempts=${job.attempts} stage=${job.processingStage} status=${job.status}`,
    );

    console.log(
      `[ProductImportWorker] Processing ${job._id} - ${job.fileName}`,
    );

    try {
      await processProductImport(job._id);

      console.log(
        `[ProductImportWorker] Finished ${job._id} - ${job.fileName}`,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown import error";

      console.error(
        `[ProductImportWorker] Import ${job._id} failed: ${message}`,
      );

      // Fatal job-level failure.
      // Row-level failures are handled by productImportService and result
      // in completed_with_errors instead.
      await ProductImport.findByIdAndUpdate(job._id, {
        $set: {
          status: "failed",
          processingStage: "failed",
          failureReason: message,
          completedAt: new Date(),
          processingRow: 0,
          processingSku: "",
          processingProductName: "",
        },
      });
    }
  } catch (error) {
    console.error("[ProductImportWorker] Worker error:", error);
  } finally {
    processingJob = false;
  }
}

// ============================================================
// START WORKER
// ============================================================

export function startProductImportWorker(): void {
  if (workerRunning) {
    return;
  }

  workerRunning = true;

  console.log(
    `[ProductImportWorker] Worker started (poll every ${POLL_INTERVAL_MS}ms)`,
  );

  // Check immediately on startup.
  void processNextProductImport();

  timer = setInterval(() => {
    void processNextProductImport();
  }, POLL_INTERVAL_MS);
}

// ============================================================
// STOP WORKER
// ============================================================

export function stopProductImportWorker(): void {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  workerRunning = false;

  console.log("[ProductImportWorker] Worker stopped");
}
