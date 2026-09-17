import { detectSignalGap } from "../services/aisSignalGapService.js";

const detectSignalGapController = async (req, res) => {
  try {
    const { vesselId } = req.params;

    const result = await detectSignalGap(vesselId);

    res.status(200).json({
      message: "AIS signal gap analysis completed successfully",
      data: result,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid vessel ID",
      });
    }

    console.error("AIS signal gap detection error:", error);

    res.status(500).json({
      message: "Failed to analyze AIS signal gap",
    });
  }
};

export { detectSignalGapController };