import Vessel from "../models/vesselModel.js"

const createVessel = async (vesselData) => {
  const vessel = await Vessel.create(vesselData);

  return vessel;
};

const getAllVessels = async () => {
  const vessels = await Vessel.find().sort({ createdAt: -1 });

  return vessels;
};

const getVesselById = async (vesselId) => {
  const vessel = await Vessel.findById(vesselId);

  return vessel;
};


const updateVessel = async (vesselId, vesselData) => {
  const vessel = await Vessel.findByIdAndUpdate(
    vesselId,
    vesselData,
    {
      new: true,
      runValidators: true,
    }
  );

  return vessel;
};


const deleteVessel = async (vesselId) => {
  const vessel = await Vessel.findByIdAndDelete(vesselId);

  return vessel;
};

export {
  createVessel,
  getAllVessels,
  getVesselById,
  updateVessel,
  deleteVessel
};