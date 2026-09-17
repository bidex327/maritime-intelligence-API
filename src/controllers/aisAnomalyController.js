import { detectSpeedChange } from "../services/aisAnomalyService.js";

const detectSpeedChangeController = async (req, res) => {
  try {
    const { vesselId } = req.params;

    const result = await detectSpeedChange(vesselId);

    res.status(200).json({
      message: "AIS speed change analysis completed successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Speed change detection error:", error);

    res.status(500).json({
      message: "Failed to analyze AIS speed change",
    });
  }
};

export { detectSpeedChangeController };