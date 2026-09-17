import express from "express";

import {
  detectHeadingChangeController,
} from "../controllers/aisHeadingAnomalyController.js";

const router = express.Router();

router.get(
  "/vessel/:vesselId/heading-change",
  detectHeadingChangeController
);

export default router;