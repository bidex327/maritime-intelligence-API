import express from "express";

import {
  createAisObservationController,
  getAllAisObservationsController,
  getAisObservationByIdController,
  getVesselMovementHistoryController
} from "../controllers/aisObservationController.js";

const router = express.Router();

router.post("/", createAisObservationController);

router.get("/", getAllAisObservationsController);
router.get( "/vessel/:vesselId/history",getVesselMovementHistoryController);

router.get("/:id", getAisObservationByIdController);


export default router;