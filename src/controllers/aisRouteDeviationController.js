import { detectRouteDeviation } from "../services/aisRouteDeviationService.js";

const detectRouteDeviationController = async (req, res) => {
  try {
    const { vesselId } = req.params;
    const {
      referenceLatitude,
      referenceLongitude,
      thresholdMeters,
    } = req.query;

    if (
      referenceLatitude === undefined ||
      referenceLongitude === undefined
    ) {
      return res.status(400).json({
        message:
          "Reference latitude and reference longitude are required",
      });
    }

    const latitude = Number(referenceLatitude);
    const longitude = Number(referenceLongitude);
   const threshold =
  thresholdMeters !== undefined
    ? Number(thresholdMeters)
    : 1000;

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {
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

    if (!Number.isFinite(threshold) || threshold <= 0) {
      return res.status(400).json({
        message: "Threshold must be a positive number",
      });
    }

    const result = await detectRouteDeviation(
      vesselId,
      latitude,
      longitude,
      threshold
    );

    res.status(200).json({
      message: "AIS route deviation analysis completed successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Route deviation detection error:", error);

    res.status(500).json({
      message: "Failed to analyze AIS route deviation",
    });
  }
};

export { detectRouteDeviationController };