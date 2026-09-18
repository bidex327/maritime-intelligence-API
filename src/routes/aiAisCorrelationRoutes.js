import express from "express";
import {
  getCorrelationByAiDetectionController,
} from "../controllers/aiAisCorrelationController.js";

const router = express.Router();

router.get(
  "/detection/:aiDetectionId",
  getCorrelationByAiDetectionController
);

export default router;