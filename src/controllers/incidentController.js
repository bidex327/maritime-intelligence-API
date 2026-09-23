import {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
} from "../services/incidentService.js";

const createIncidentController = async (req, res) => {
  try {
    const incident = await createIncident(req.body);

    return res.status(201).json({
      message: "Incident created successfully",
      data: incident,
    });
  } catch (error) {
    console.error("Incident creation error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid incident data",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "Failed to create incident",
    });
  }
};

const getAllIncidentsController = async (req, res) => {
  try {
    const incidents = await getAllIncidents();

    return res.status(200).json({
      message: "Incidents retrieved successfully",
      count: incidents.length,
      data: incidents,
    });
  } catch (error) {
    console.error("Incident retrieval error:", error);

    return res.status(500).json({
      message: "Failed to retrieve incidents",
    });
  }
};

const getIncidentByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        message: "Incident ID is required",
      });
    }

    const incident = await getIncidentById(id);

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      message: "Incident retrieved successfully",
      data: incident,
    });
  } catch (error) {
    console.error("Incident retrieval by ID error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid incident ID",
      });
    }

    return res.status(500).json({
      message: "Failed to retrieve incident",
    });
  }
};

const updateIncidentStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "Incident ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        message: "Incident status is required",
      });
    }

    const incident = await updateIncidentStatus(id, status);

    if (!incident) {
      return res.status(404).json({
        message: "Incident not found",
      });
    }

    return res.status(200).json({
      message: "Incident status updated successfully",
      data: incident,
    });
  } catch (error) {
    console.error("Incident status update error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid incident ID",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid incident status",
        errors: Object.values(error.errors).map(
          (validationError) => validationError.message
        ),
      });
    }

    return res.status(500).json({
      message: "Failed to update incident status",
    });
  }
};

export {
  createIncidentController,
  getAllIncidentsController,
  getIncidentByIdController,
  updateIncidentStatusController,
};