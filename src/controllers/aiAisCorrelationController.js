
import { findClosestAisObservation } from "../services/aiAisCorrelationService.js";

const getCorrelationByAiDetectionController = async (req, res) => {
  try {
    const { aiDetectionId } = req.params;

    if (!aiDetectionId) {
      return res.status(400).json({
        message: "AI detection ID is required",
      });
    }

    const result = await findClosestAisObservation(aiDetectionId);

    if (!result.matched) {
      return res.status(200).json(result);
    }

    return res.status(200).json({
      message: "AI-AIS correlation retrieved successfully",
      data: result.data,
    });
  } catch (error) {
    console.error("AI-AIS correlation error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid AI detection ID",
      });
    }

    return res.status(500).json({
      message: "Failed to process AI-AIS correlation",
    });
  }
};

export { getCorrelationByAiDetectionController };
