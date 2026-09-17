import AisObservation from "../models/aisObservationModel.js";

const detectHeadingChange = async (vesselId) => {
  const observations = await AisObservation.find({
    vessel: vesselId,
  }).sort({ observedAt: 1 });

  if (observations.length < 2) {
    return {
      detected: false,
      message: "Not enough AIS observations to detect a heading change",
      data: null,
    };
  }

  const previousObservation = observations[observations.length - 2];
  const latestObservation = observations[observations.length - 1];

  const previousHeading = previousObservation.heading;
  const latestHeading = latestObservation.heading;

  let headingChange = Math.abs(latestHeading - previousHeading);

  // Handle the 0°/360° boundary.
  if (headingChange > 180) {
    headingChange = 360 - headingChange;
  }

  return {
    detected: headingChange >= 45,
    message:
      headingChange >= 45
        ? "Significant heading change detected"
        : "No significant heading change detected",
    data: {
      previousHeading,
      latestHeading,
      headingChange,
      previousObservedAt: previousObservation.observedAt,
      latestObservedAt: latestObservation.observedAt,
    },
  };
};

export { detectHeadingChange };