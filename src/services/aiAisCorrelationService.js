import AiDetection from "../models/aiDetectionModel.js";
import AisObservation from "../models/aisObservationModel.js";
import AiAisCorrelation from "../models/aiAisCorrelationModel.js";
import { calculateDistanceMeters } from "./geoDistanceService.js";
import { calculateMatchScore } from "./aiAisMatchScoreService.js";

const findClosestAisObservation = async (
  aiDetectionId,
  maxDistanceMeters = 1000,
  maxTimeDifferenceSeconds = 300
) => {
  const aiDetection = await AiDetection.findById(aiDetectionId);

  if (!aiDetection) {
    return {
      matched: false,
      message: "AI detection not found",
      data: null,
    };
  }

  const aiDetectedAt = new Date(aiDetection.detectedAt);

  const observations = await AisObservation.find({
    observedAt: {
      $gte: new Date(
        aiDetectedAt.getTime() - maxTimeDifferenceSeconds * 1000
      ),
      $lte: new Date(
        aiDetectedAt.getTime() + maxTimeDifferenceSeconds * 1000
      ),
    },
  }).populate("vessel");

  if (observations.length === 0) {
    return {
      matched: false,
      message: "No AIS observations found within the time window",
      data: null,
    };
  }

  const candidates = observations
    .map((observation) => {
      const distanceMeters = calculateDistanceMeters(
        aiDetection.position.latitude,
        aiDetection.position.longitude,
        observation.position.latitude,
        observation.position.longitude
      );

      const timeDifferenceSeconds =
        Math.abs(
          new Date(observation.observedAt).getTime() -
            aiDetectedAt.getTime()
        ) / 1000;

      return {
        observation,
        distanceMeters,
        timeDifferenceSeconds,
      };
    })
    .filter(
      (candidate) => candidate.distanceMeters <= maxDistanceMeters
    );

  if (candidates.length === 0) {
    return {
      matched: false,
      message: "No AIS observations found within the distance threshold",
      data: null,
    };
  }

  const closestCandidate = candidates.sort(
    (a, b) => a.distanceMeters - b.distanceMeters
  )[0];

 const matchScore = calculateMatchScore(
  closestCandidate.distanceMeters,
  closestCandidate.timeDifferenceSeconds,
  maxDistanceMeters,
  maxTimeDifferenceSeconds
);

const matchThreshold = 0.7;
const matched = matchScore >= matchThreshold;

if (matched && !closestCandidate.observation.vessel) {
  return {
    matched: false,
    message: "Closest AIS observation has no known vessel",
    data: {
      aiDetectionId: aiDetection._id,
      candidateCount: candidates.length,
      maxDistanceMeters,
      maxTimeDifferenceSeconds,
      matchThreshold,
      closestCandidate,
      matchScore,
      correlation: null,
    },
  };
}

let correlation = null;

if (matched) {
  correlation = await AiAisCorrelation.findOne({
    aiDetection: aiDetection._id,
    aisObservation: closestCandidate.observation._id,
  });

  if (!correlation) {
    correlation = await AiAisCorrelation.create({
      aiDetection: aiDetection._id,
      vessel: closestCandidate.observation.vessel._id,
      aisObservation: closestCandidate.observation._id,
      distanceMeters: closestCandidate.distanceMeters,
      timeDifferenceSeconds:
        closestCandidate.timeDifferenceSeconds,
      matchScore,
      status: "potential",
    });
  }
}

  return {
    matched,
    message: matched
      ? "Potential AIS match found"
      : "AIS candidates found but match score is below threshold",
    data: {
      aiDetectionId: aiDetection._id,
      candidateCount: candidates.length,
      maxDistanceMeters,
      maxTimeDifferenceSeconds,
      matchThreshold,
      closestCandidate,
      matchScore,
      correlation,
    },
  };
};

export { findClosestAisObservation };