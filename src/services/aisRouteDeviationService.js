import AisObservation from "../models/aisObservationModel.js";

const calculateDistanceInMeters = (
  latitude1,
  longitude1,
  latitude2,
  longitude2
) => {
  const earthRadius = 6371000;

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const lat1 = toRadians(latitude1);
  const lat2 = toRadians(latitude2);
  const deltaLatitude = toRadians(latitude2 - latitude1);
  const deltaLongitude = toRadians(longitude2 - longitude1);

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLongitude / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
};

const detectRouteDeviation = async (
  vesselId,
  referenceLatitude,
  referenceLongitude,
  thresholdMeters = 1000
) => {
  const observation = await AisObservation.findOne({
    vessel: vesselId,
  }).sort({ observedAt: -1 });

  if (!observation) {
    return {
      detected: false,
      message: "No AIS observation found for this vessel",
      data: null,
    };
  }

  const distanceFromReference = calculateDistanceInMeters(
    observation.position.latitude,
    observation.position.longitude,
    referenceLatitude,
    referenceLongitude
  );

  return {
    detected: distanceFromReference > thresholdMeters,
    message:
      distanceFromReference > thresholdMeters
        ? "Potential route deviation detected"
        : "No significant route deviation detected",
    data: {
      vesselPosition: {
        latitude: observation.position.latitude,
        longitude: observation.position.longitude,
      },
      referencePosition: {
        latitude: referenceLatitude,
        longitude: referenceLongitude,
      },
      distanceFromReference,
      thresholdMeters,
      observedAt: observation.observedAt,
    },
  };
};

export {
  calculateDistanceInMeters,
  detectRouteDeviation,
};