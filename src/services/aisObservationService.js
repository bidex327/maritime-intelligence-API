import AisObservation from "../models/aisObservationModel.js";
import Vessel from "../models/vesselModel.js";

const createAisObservation = async (observationData) => {
  if (observationData.vessel) {
    const vessel = await Vessel.findById(observationData.vessel);

    if (!vessel) {
      const error = new Error("Referenced vessel not found");
      error.name = "VesselNotFoundError";
      throw error;
    }
  }

  const observation = await AisObservation.create(observationData);

  return observation;
};

const getAllAisObservations = async () => {
  const observations = await AisObservation.find()
    .populate("vessel")
    .sort({ observedAt: -1 });

  return observations;
};

const getAisObservationById = async (observationId) => {
  const observation = await AisObservation.findById(observationId)
    .populate("vessel");

  return observation;
};

export {
  createAisObservation,
  getAllAisObservations,
  getAisObservationById,
};