import AisObservation from "../models/aisObservationModel.js";
import Vessel from "../models/vesselModel.js";

const createAisObservation = async (observationData) => {
  const vessel = await Vessel.findOne({
    mmsiNumber: observationData.mmsiNumber,
  });

  const observationToCreate = {
    ...observationData,
    vessel: vessel ? vessel._id : undefined,
  };

  const observation = await AisObservation.create(observationToCreate);

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

const getVesselMovementHistory = async (vesselId) => {
  const observations = await AisObservation.find({
    vessel: vesselId,
  })
    .populate("vessel")
    .sort({ observedAt: 1 });

  return observations;
};
const getLatestAisObservation = async (vesselId) => {
  const observation = await AisObservation.findOne({
    vessel: vesselId,
  })
    .populate("vessel")
    .sort({ observedAt: -1 });

  return observation;
};

export {
  createAisObservation,
  getAllAisObservations,
  getAisObservationById,
  getVesselMovementHistory,
  getLatestAisObservation
};