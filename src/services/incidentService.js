import Incident from "../models/incidentModel.js";

const createIncident = async (incidentData) => {
  const incident = await Incident.create(incidentData);

  return incident;
};

const getAllIncidents = async () => {
  const incidents = await Incident.find()
    .populate("rule")
    .populate("aiDetection")
    .populate("vessel")
    .populate("aisObservation")
    .sort({ detectedAt: -1 });

  return incidents;
};

const getIncidentById = async (id) => {
  const incident = await Incident.findById(id)
    .populate("rule")
    .populate("aiDetection")
    .populate("vessel")
    .populate("aisObservation");

  return incident;
};

const updateIncidentStatus = async (id, status) => {
  const incident = await Incident.findByIdAndUpdate(
    id,
    { status },
    { returnDocument: "after", runValidators: true }
  );

  return incident;
};

export {
  createIncident,
  getAllIncidents,
  getIncidentById,
  updateIncidentStatus,
};