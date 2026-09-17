import {
  createAisObservation,
  getAllAisObservations,
  getAisObservationById,
  getVesselMovementHistory
} from "../services/aisObservationService.js";

const createAisObservationController = async (req, res) => {
  try {
    const observation = await createAisObservation(req.body);

    res.status(201).json({
      message: "AIS observation created successfully",
      data: observation,
    });
  } catch (error) {
    if (error.name === "VesselNotFoundError") {
  return res.status(404).json({
    message: "Referenced vessel not found",
  });
}
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid AIS observation data",
        errors: Object.values(error.errors).map((fieldError) => ({
          field: fieldError.path,
          message: fieldError.message,
        })),
      });
    }

    console.error("Create AIS observation error:", error);

    res.status(500).json({
      message: "Failed to create AIS observation",
    });
  }
};

const getAllAisObservationsController = async (req, res) => {
  try {
    const observations = await getAllAisObservations();

    res.status(200).json({
      message: "AIS observations retrieved successfully",
      data: observations,
    });
  } catch (error) {
    console.error("Get AIS observations error:", error);

    res.status(500).json({
      message: "Failed to retrieve AIS observations",
    });
  }
};

const getAisObservationByIdController = async (req, res) => {
  try {
    const observation = await getAisObservationById(req.params.id);

    if (!observation) {
      return res.status(404).json({
        message: "AIS observation not found",
      });
    }

    res.status(200).json({
      message: "AIS observation retrieved successfully",
      data: observation,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid AIS observation ID",
      });
    }

    console.error("Get AIS observation by ID error:", error);

    res.status(500).json({
      message: "Failed to retrieve AIS observation",
    });
  }
};

const getVesselMovementHistoryController = async (req, res) => {
  try {
    const observations = await getVesselMovementHistory(req.params.vesselId);

    res.status(200).json({
      message: "Vessel movement history retrieved successfully",
      data: observations,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Get vessel movement history error:", error);

    res.status(500).json({
      message: "Failed to retrieve vessel movement history",
    });
  }
};

export {
  createAisObservationController,
  getAllAisObservationsController,
  getAisObservationByIdController,
  getVesselMovementHistoryController
};