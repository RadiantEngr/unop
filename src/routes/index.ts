import express from "express";
const router = express.Router();

import healthCheck from "../controllers/HealthCheckController";

router.get("/health", healthCheck);

export default router;
