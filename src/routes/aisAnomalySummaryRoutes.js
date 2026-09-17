import express from "express";

import {
  getAisAnomalySummaryController,
} from "../controllers/aisAnomalySummaryController.js";

const router = express.Router();

router.get(
  "/vessel/:vesselId/summary",
  getAisAnomalySummaryController
);

export default router;