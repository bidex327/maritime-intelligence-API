import AisObservation from "../models/aisObservationModel.js";

const detectSignalGap = async (vesselId) => {
  const observations = await AisObservation.find({
    vessel: vesselId,
  }).sort({ observedAt: 1 });

  if (observations.length < 2) {
    return {
      detected: false,
      message: "Not enough AIS observations to detect a signal gap",
      data: null,
    };
  }

  const previousObservation = observations[observations.length - 2];
  const latestObservation = observations[observations.length - 1];

  const previousTime = new Date(previousObservation.observedAt);
  const latestTime = new Date(latestObservation.observedAt);

  const gapInMilliseconds = latestTime - previousTime;

  const gapInMinutes = gapInMilliseconds / (1000 * 60);

  return {
    detected: gapInMinutes > 30,
    message:
      gapInMinutes > 30
        ? "AIS signal gap detected"
        : "No significant AIS signal gap detected",
    data: {
      previousObservedAt: previousObservation.observedAt,
      latestObservedAt: latestObservation.observedAt,
      gapInMinutes,
    },
  };
};

export { detectSignalGap };