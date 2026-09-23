import express from "express";

import {
  createAlertController,
  getAllAlertsController,
  getAlertByIdController,
  updateAlertStatusController,
} from "../controllers/alertController.js";

const router = express.Router();

router.post("/", createAlertController);
router.get("/", getAllAlertsController);
router.get("/:id", getAlertByIdController);
router.patch("/:id/status", updateAlertStatusController);

export default router;