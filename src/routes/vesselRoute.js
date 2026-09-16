import express from "express";

import {
  createVesselController,
  getAllVesselsController,
  getVesselByIdController,
  updateVesselController,
  deleteVesselController,
} from "../controllers/vesselController.js";

const router = express.Router();

router.post("/", createVesselController);

router.get("/", getAllVesselsController);

router.get("/:id", getVesselByIdController);

router.patch("/:id", updateVesselController);

router.delete("/:id", deleteVesselController);
export default router;
