import express from "express";

import {
  createIncidentController,
  getAllIncidentsController,
  getIncidentByIdController,
  updateIncidentStatusController,
} from "../controllers/incidentController.js";

const router = express.Router();

router.post("/", createIncidentController);

router.get("/", getAllIncidentsController);

router.get("/:id", getIncidentByIdController);

router.patch("/:id/status", updateIncidentStatusController);

export default router;