import express from "express";

import {
  createAisObservationController,
  getAllAisObservationsController,
  getAisObservationByIdController,
} from "../controllers/aisObservationController.js";

const router = express.Router();

router.post("/", createAisObservationController);

router.get("/", getAllAisObservationsController);

router.get("/:id", getAisObservationByIdController);

export default router;