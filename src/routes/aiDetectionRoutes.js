import express from "express";

import {
  createAiDetectionController,
  getAllAiDetectionsController,
  getAiDetectionByIdController,
  getAiDetectionsByTypeController,
} from "../controllers/aiDetectionController.js";

const router = express.Router();

router.post("/", createAiDetectionController);

router.get("/", getAllAiDetectionsController);

router.get("/type/:detectionType", getAiDetectionsByTypeController);

router.get("/:id", getAiDetectionByIdController);

export default router;