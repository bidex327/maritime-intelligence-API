import express from "express";

import {
  createAisObservationController,
  getAllAisObservationsController,
  getAisObservationByIdController,
  getVesselMovementHistoryController,
  getLatestAisObservationController,
  getRecentAisObservationsController
} from "../controllers/aisObservationController.js";

const router = express.Router();

router.post("/", createAisObservationController);

router.get("/", getAllAisObservationsController);
router.get("/vessel/:vesselId/history",getVesselMovementHistoryController);
router.get("/vessel/:vesselId/latest",getLatestAisObservationController);
router.get("/vessel/:vesselId/recent",getRecentAisObservationsController);
router.get("/:id", getAisObservationByIdController);



export default router;