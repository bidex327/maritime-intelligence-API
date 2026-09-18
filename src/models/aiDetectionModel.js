import mongoose from "mongoose";

const aiDetectionSchema = new mongoose.Schema(
  {
    detectionType: {
      type: String,
      required: true,
      trim: true,
    },

    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      latitude: {
        type: Number,
        required: true,
        min: -90,
        max: 90,
      },
      longitude: {
        type: Number,
        required: true,
        min: -180,
        max: 180,
      },
    },

    boundingBox: {
      x: {
        type: Number,
        required: true,
        min: 0,
      },
      y: {
        type: Number,
        required: true,
        min: 0,
      },
      width: {
        type: Number,
        required: true,
        min: 0,
      },
      height: {
        type: Number,
        required: true,
        min: 0,
      },
    },

    detectedAt: {
      type: Date,
      required: true,
      validate: {
        validator: (value) => value <= new Date(),
        message: "Detection time cannot be in the future",
      },
    },
  },
  { timestamps: true }
);

const AiDetection = mongoose.model(
  "AiDetection",
  aiDetectionSchema
);

export default AiDetection;