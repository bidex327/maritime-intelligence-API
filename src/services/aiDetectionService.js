import AiDetection from "../models/aiDetectionModel.js";

const createAiDetection = async (detectionData) => {
  const aiDetection = await AiDetection.create(detectionData);

  return aiDetection;
};

const getAllAiDetections = async () => {
  const aiDetections = await AiDetection.find().sort({
    detectedAt: -1,
  });

  return aiDetections;
};

const getAiDetectionById = async (id) => {
  const aiDetection = await AiDetection.findById(id);

  return aiDetection;
};

const getAiDetectionsByType = async (detectionType) => {
  const aiDetections = await AiDetection.find({
    detectionType,
  }).sort({
    detectedAt: -1,
  });

  return aiDetections;
};

const getAiDetectionsBySource = async (source) => {
  const aiDetections = await AiDetection.find({
    source,
  }).sort({
    detectedAt: -1,
  });

  return aiDetections;
};
export {
  createAiDetection,
  getAllAiDetections,
  getAiDetectionById,
  getAiDetectionsByType,
  getAiDetectionsBySource
};