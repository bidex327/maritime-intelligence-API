import AisObservation from "../models/aisObservationModel.js";

const detectSpeedChange = async (vesselId) => {
  const observations = await AisObservation.find({
    vessel: vesselId,
  }).sort({ observedAt: 1 });

  if (observations.length < 2) {
    return {
      detected: false,
      message: "Not enough AIS observations to detect a speed change",
      data: null,
    };
  }

  const previousObservation = observations[observations.length - 2];
  const latestObservation = observations[observations.length - 1];

  const speedChange =
    latestObservation.speed - previousObservation.speed;

  return {
    detected: speedChange !== 0,
    message:
      speedChange !== 0
        ? "Speed change detected"
        : "No speed change detected",
    data: {
      previousSpeed: previousObservation.speed,
      latestSpeed: latestObservation.speed,
      speedChange,
      previousObservedAt: previousObservation.observedAt,
      latestObservedAt: latestObservation.observedAt,
    },
  };
};

export { detectSpeedChange };