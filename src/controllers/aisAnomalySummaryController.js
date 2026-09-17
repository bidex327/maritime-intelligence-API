import { getAisAnomalySummary } from "../services/aisAnomalySummaryService.js";

const getAisAnomalySummaryController = async (req, res) => {
  try {
    const { vesselId } = req.params;

    const {
      referenceLatitude,
      referenceLongitude,
      thresholdMeters,
    } = req.query;

    let latitude;
    let longitude;
    let threshold = 1000;

    if (
  thresholdMeters !== undefined &&
  referenceLatitude === undefined &&
  referenceLongitude === undefined
) {
  return res.status(400).json({
    message:
      "Reference coordinates are required when threshold is provided",
  });
}

    if (
      referenceLatitude !== undefined ||
      referenceLongitude !== undefined
    ) {
      if (
        referenceLatitude === undefined ||
        referenceLongitude === undefined
      ) {
        return res.status(400).json({
          message:
            "Both reference latitude and reference longitude are required",
        });
      }

      latitude = Number(referenceLatitude);
      longitude = Number(referenceLongitude);

      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
        return res.status(400).json({
          message: "Reference coordinates must be valid numbers",
        });
      }

      if (latitude < -90 || latitude > 90) {
        return res.status(400).json({
          message: "Reference latitude must be between -90 and 90",
        });
      }

      if (longitude < -180 || longitude > 180) {
        return res.status(400).json({
          message:
            "Reference longitude must be between -180 and 180",
        });
      }
    }

    if (thresholdMeters !== undefined) {
      threshold = Number(thresholdMeters);

      if (!Number.isFinite(threshold) || threshold <= 0) {
        return res.status(400).json({
          message: "Threshold must be a positive number",
        });
      }
    }

    const result = await getAisAnomalySummary(
      vesselId,
      latitude,
      longitude,
      threshold
    );

    res.status(200).json({
      message: "AIS anomaly summary generated successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("AIS anomaly summary error:", error);

    res.status(500).json({
      message: "Failed to generate AIS anomaly summary",
    });
  }
};

export { getAisAnomalySummaryController };