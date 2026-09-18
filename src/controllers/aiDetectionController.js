import {
  createAiDetection,
  getAllAiDetections,
  getAiDetectionById,
  getAiDetectionsByType,
  getAiDetectionsBySource
} from "../services/aiDetectionService.js";

const createAiDetectionController = async (req, res) => {
  try {
    const aiDetection = await createAiDetection(req.body);

    res.status(201).json({
      message: "AI detection created successfully",
      data: aiDetection,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Invalid AI detection data",
        errors: Object.fromEntries(
          Object.entries(error.errors).map(([field, detail]) => [
            field,
            detail.message,
          ])
        ),
      });
    }

    console.error("AI detection creation error:", error);

    res.status(500).json({
      message: "Failed to create AI detection",
    });
  }
};

const getAllAiDetectionsController = async (req, res) => {
  try {
    const aiDetections = await getAllAiDetections();

    res.status(200).json({
      message: "AI detections retrieved successfully",
      count: aiDetections.length,
      data: aiDetections,
    });
  } catch (error) {
    console.error("AI detection retrieval error:", error);

    res.status(500).json({
      message: "Failed to retrieve AI detections",
    });
  }
};

const getAiDetectionByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const aiDetection = await getAiDetectionById(id);

    if (!aiDetection) {
      return res.status(404).json({
        message: "AI detection not found",
      });
    }

    res.status(200).json({
      message: "AI detection retrieved successfully",
      data: aiDetection,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid AI detection ID",
      });
    }

    console.error("AI detection retrieval error:", error);

    res.status(500).json({
      message: "Failed to retrieve AI detection",
    });
  }
};

const getAiDetectionsByTypeController = async (req, res) => {
  try {
    const { detectionType } = req.params;

  

    const aiDetections = await getAiDetectionsByType(detectionType);

    res.status(200).json({
      message: "AI detections retrieved successfully",
      count: aiDetections.length,
      data: aiDetections,
    });
  } catch (error) {
    console.error("AI detection type retrieval error:", error);

    res.status(500).json({
      message: "Failed to retrieve AI detections",
    });
  }
};

const getAiDetectionsBySourceController = async (req, res) => {
  try {
    const { source } = req.params;
   

    const aiDetections = await getAiDetectionsBySource(source);

    res.status(200).json({
      message: "AI detections retrieved successfully",
      count: aiDetections.length,
      data: aiDetections,
    });
  } catch (error) {
    console.error("AI detection source retrieval error:", error);

    res.status(500).json({
      message: "Failed to retrieve AI detections",
    });
  }
};

export {
  createAiDetectionController,
  getAllAiDetectionsController,
  getAiDetectionByIdController,
  getAiDetectionsByTypeController,
  getAiDetectionsBySourceController
};