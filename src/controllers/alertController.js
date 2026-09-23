import {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlertStatus,
} from "../services/alertService.js";

const createAlertController = async (req, res) => {
  try {
    const alert = await createAlert(req.body);

    return res.status(201).json({
      message: "Alert created successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Alert creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid alert data",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "Failed to create alert",
    });
  }
};

const getAllAlertsController = async (req, res) => {
  try {
    const alerts = await getAllAlerts();

    return res.status(200).json({
      message: "Alerts retrieved successfully",
      count: alerts.length,
      data: alerts,
    });
  } catch (error) {
    console.error("Alert retrieval error:", error);

    return res.status(500).json({
      message: "Failed to retrieve alerts",
    });
  }
};

const getAlertByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Alert ID is required",
      });
    }

    const alert = await getAlertById(id);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      message: "Alert retrieved successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Alert retrieval by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid alert ID",
      });
    }

    return res.status(500).json({
      message: "Failed to retrieve alert",
    });
  }
};

const updateAlertStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Alert ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Alert status is required",
      });
    }

    const alert = await updateAlertStatus(id, status);

    if (!alert) {
      return res.status(404).json({
        message: "Alert not found",
      });
    }

    return res.status(200).json({
      message: "Alert status updated successfully",
      data: alert,
    });
  } catch (error) {
    console.error("Alert status update error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid alert ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid alert status",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "Failed to update alert status",
    });
  }
};

export {
  createAlertController,
  getAllAlertsController,
  getAlertByIdController,
  updateAlertStatusController,
};