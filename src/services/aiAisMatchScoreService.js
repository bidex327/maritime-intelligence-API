const calculateMatchScore = (
  distanceMeters,
  timeDifferenceSeconds,
  maxDistanceMeters = 1000,
  maxTimeDifferenceSeconds = 300
) => {
  const distanceScore =
    1 - distanceMeters / maxDistanceMeters;

  const timeScore =
    1 - timeDifferenceSeconds / maxTimeDifferenceSeconds;

  const boundedDistanceScore = Math.max(0, Math.min(1, distanceScore));
  const boundedTimeScore = Math.max(0, Math.min(1, timeScore));

  const matchScore =
    (boundedDistanceScore + boundedTimeScore) / 2;

  return matchScore;
};

export { calculateMatchScore };