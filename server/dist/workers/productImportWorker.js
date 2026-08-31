"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopProductImportWorker = exports.startProductImportWorker = void 0;
const crypto_1 = __importDefault(require("crypto"));
const ProductImport_1 = __importDefault(require("../models/ProductImport"));
const productImportService_1 = require("../services/productImportService");
const POLL_INTERVAL_MS = 2000;
const STALE_JOB_TIMEOUT_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 3;
let workerRunning = false;
const generateJobId = () => {
    return `product-import-${crypto_1.default.randomUUID()}`;
};
const recoverStaleJobs = () => __awaiter(void 0, void 0, void 0, function* () {
    const staleBefore = new Date(Date.now() - STALE_JOB_TIMEOUT_MS);
    const result = yield ProductImport_1.default.updateMany({
        status: "processing",
        processingStartedAt: {
            $lt: staleBefore,
        },
        attempts: {
            $lt: MAX_ATTEMPTS,
        },
    }, {
        $set: {
            status: "uploaded",
            processingStartedAt: undefined,
        },
    });
    if (result.modifiedCount > 0) {
        console.log(`[ProductImportWorker] Recovered ${result.modifiedCount} stale job(s)`);
    }
});
const claimNextJob = () => __awaiter(void 0, void 0, void 0, function* () {
    const jobId = generateJobId();
    const now = new Date();
    const job = yield ProductImport_1.default.findOneAndUpdate({
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
    }, {
        $set: {
            status: "processing",
            jobId,
            processingStartedAt: now,
            startedAt: now,
        },
        $inc: {
            attempts: 1,
        },
    }, {
        sort: {
            createdAt: 1,
        },
        returnDocument: "after",
    });
    return job;
});
const processJob = (productImportId, jobId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[ProductImportWorker] Starting job ${jobId} for import ${productImportId}`);
    try {
        yield (0, productImportService_1.processProductImport)(productImportId);
        console.log(`[ProductImportWorker] Job ${jobId} completed successfully`);
    }
    catch (error) {
        console.error(`[ProductImportWorker] Job ${jobId} failed:`, error);
        const productImport = yield ProductImport_1.default.findById(productImportId);
        if (!productImport) {
            return;
        }
        if (productImport.attempts && productImport.attempts < MAX_ATTEMPTS) {
            yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
                $set: {
                    status: "uploaded",
                    processingStartedAt: undefined,
                },
            });
            console.log(`[ProductImportWorker] Job ${jobId} will be retried`);
        }
        else {
            yield ProductImport_1.default.findByIdAndUpdate(productImportId, {
                $set: {
                    status: "failed",
                    completedAt: new Date(),
                },
            });
            console.error(`[ProductImportWorker] Job ${jobId} permanently failed`);
        }
    }
});
const workerLoop = () => __awaiter(void 0, void 0, void 0, function* () {
    if (workerRunning) {
        return;
    }
    workerRunning = true;
    console.log("[ProductImportWorker] Worker started");
    while (workerRunning) {
        try {
            yield recoverStaleJobs();
            const job = yield claimNextJob();
            if (!job) {
                yield new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
                continue;
            }
            yield processJob(job._id.toString(), job.jobId);
        }
        catch (error) {
            console.error("[ProductImportWorker] Worker loop error:", error);
            yield new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        }
    }
});
const startProductImportWorker = () => {
    void workerLoop();
};
exports.startProductImportWorker = startProductImportWorker;
const stopProductImportWorker = () => {
    workerRunning = false;
};
exports.stopProductImportWorker = stopProductImportWorker;
