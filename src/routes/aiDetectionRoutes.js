import express from "express";

import {
  createAiDetectionController,
  getAllAiDetectionsController,
  getAiDetectionByIdController,
  getAiDetectionsByTypeController,
  getAiDetectionsBySourceController,
  getAiDetectionsByConfidenceController
} from "../controllers/aiDetectionController.js";

const router = express.Router();

router.post("/", createAiDetectionController);

router.get("/", getAllAiDetectionsController);

router.get("/type/:detectionType", getAiDetectionsByTypeController);

router.get("/source/:source", getAiDetectionsBySourceController);

router.get("/confidence", getAiDetectionsByConfidenceController);

router.get("/:id", getAiDetectionByIdController);

export default router;