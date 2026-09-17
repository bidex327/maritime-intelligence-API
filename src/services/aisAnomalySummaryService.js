import { detectSpeedChange } from "./aisAnomalyService.js";
import { detectSignalGap } from "./aisSignalGapService.js";
import { detectHeadingChange } from "./aisHeadingAnomalyService.js";
import { detectRouteDeviation } from "./aisRouteDeviationService.js";

const getAisAnomalySummary = async (
  vesselId,
  referenceLatitude,
  referenceLongitude,
  thresholdMeters = 1000
) => {
  const [speedChange, signalGap, headingChange] =
    await Promise.all([
      detectSpeedChange(vesselId),
      detectSignalGap(vesselId),
      detectHeadingChange(vesselId),
    ]);

  let routeDeviation = null;

  if (
    referenceLatitude !== undefined &&
    referenceLongitude !== undefined
  ) {
    routeDeviation = await detectRouteDeviation(
      vesselId,
      referenceLatitude,
      referenceLongitude,
      thresholdMeters
    );
  }

  return {
    speedChange,
    signalGap,
    headingChange,
    routeDeviation,
  };
};

export { getAisAnomalySummary };