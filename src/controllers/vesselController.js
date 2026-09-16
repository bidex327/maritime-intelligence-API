import {
  createVessel,
  getAllVessels,
  getVesselById,
  updateVessel,
  deleteVessel,
} from "../services/vesselService.js";

const createVesselController = async (req, res) => {
  try {
    const vessel = await createVessel(req.body);

    res.status(201).json({
      message: "Vessel created successfully",
      data: vessel,
    });
  } catch (error) {
    // Mongoose validation error
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid vessel data",
        errors: Object.values(error.errors).map((fieldError) => ({
          field: fieldError.path,
          message: fieldError.message,
        })),
      });
    }

    // MongoDB duplicate key error
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        message: `A vessel with this ${duplicateField} already exists`,
      });
    }

    // Unexpected server/database error
    console.error("Create vessel error:", error);

    res.status(500).json({
      message: "Failed to create vessel",
    });
  }
};

const getAllVesselsController = async (req, res) => {
  try {
    const vessels = await getAllVessels();

    res.status(200).json({
      message: "Vessels retrieved successfully",
      data: vessels,
    });
  } catch (error) {
    console.error("Get vessels error:", error);

    res.status(500).json({
      message: "Failed to retrieve vessels",
    });
  }
};

const getVesselByIdController = async (req, res) => {
  try {
    const vessel = await getVesselById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        message: "Vessel not found",
      });
    }

    res.status(200).json({
      message: "Vessel retrieved successfully",
      data: vessel,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Get vessel by ID error:", error);

    res.status(500).json({
      message: "Failed to retrieve vessel",
    });
  }
};

const updateVesselController = async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        message: "No update data provided",
      });
    }

    const vessel = await updateVessel(req.params.id, req.body);

    if (!vessel) {
      return res.status(404).json({
        message: "Vessel not found",
      });
    }

    res.status(200).json({
      message: "Vessel updated successfully",
      data: vessel,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid vessel data",
        errors: Object.values(error.errors).map((fieldError) => ({
          field: fieldError.path,
          message: fieldError.message,
        })),
      });
    }

    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0];

      return res.status(409).json({
        message: `A vessel with this ${duplicateField} already exists`,
      });
    }

    console.error("Update vessel error:", error);

    res.status(500).json({
      message: "Failed to update vessel",
    });
  }
};

const deleteVesselController = async (req, res) => {
  try {
    const vessel = await deleteVessel(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        message: "Vessel not found",
      });
    }

    res.status(200).json({
      message: "Vessel deleted successfully",
      data: vessel,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Delete vessel error:", error);

    res.status(500).json({
      message: "Failed to delete vessel",
    });
  }
};

export {
  createVesselController,
  getAllVesselsController,
  getVesselByIdController,
  updateVesselController,
  deleteVesselController,
};
