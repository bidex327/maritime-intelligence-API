import Alert from "../models/alertModel.js";
import Incident from "../models/incidentModel.js";

const generateAlertFromIncident = async (incidentId) => {
  try {
    const incident = await Incident.findById(incidentId);

    if (!incident) {
      return {
        created: false,
        message: "Incident not found",
        data: null,
      };
    }

    const existingAlert = await Alert.findOne({
      incident: incidentId,
    });

    if (existingAlert) {
      return {
        created: false,
        message: "Alert already exists for this incident",
        data: existingAlert,
      };
    }

    const alert = await Alert.create({
      title: `${incident.title} Alert`,
      message: incident.description,
      severity: incident.severity,
      incident: incident._id,
      vessel: incident.vessel,
    });

    return {
      created: true,
      message: "Alert generated successfully",
      data: alert,
    };
  } catch (error) {
    if (error.name === "CastError") {
      return {
        created: false,
        message: "Invalid incident ID",
        data: null,
      };
    }

    throw error;
  }
};

export { generateAlertFromIncident };