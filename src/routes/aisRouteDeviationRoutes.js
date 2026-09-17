import express from "express";

import {
  detectRouteDeviationController,
} from "../controllers/aisRouteDeviationController.js";

const router = express.Router();

router.get(
  "/vessel/:vesselId/route-deviation",
  detectRouteDeviationController
);

export default router;