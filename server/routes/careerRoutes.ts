import { Router } from "express";

import { createJobApplication } from "../controllers/careerController";

const router = Router();

router.post("/applications", createJobApplication);

export default router;
