import express from "express";

import {
  detectSignalGapController,
} from "../controllers/aisSignalGapController.js";

const router = express.Router();

router.get(
  "/vessel/:vesselId/signal-gap",
  detectSignalGapController
);

export default router;