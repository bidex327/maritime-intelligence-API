import { detectHeadingChange } from "../services/aisHeadingAnomalyService.js";

const detectHeadingChangeController = async (req, res) => {
  try {
    const { vesselId } = req.params;

    const result = await detectHeadingChange(vesselId);

    res.status(200).json({
      message: "AIS heading change analysis completed successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("Heading change detection error:", error);

    res.status(500).json({
      message: "Failed to analyze AIS heading change",
    });
  }
};

export { detectHeadingChangeController };