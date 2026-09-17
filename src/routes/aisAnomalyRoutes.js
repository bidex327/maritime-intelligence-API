import express from "express";

import {
  detectSpeedChangeController,
} from "../controllers/aisAnomalyController.js";

const router = express.Router();

router.get("/vessel/:vesselId/speed-change",detectSpeedChangeController);

export default router;