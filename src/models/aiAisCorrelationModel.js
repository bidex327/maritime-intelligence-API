import mongoose from "mongoose";

const aiAisCorrelationSchema = new mongoose.Schema(
  {
    aiDetection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiDetection",
      required: true,
    },

    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vessel",
      required: true,
    },

    aisObservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AisObservation",
      required: true,
    },

    distanceMeters: {
      type: Number,
      required: true,
      min: 0,
    },

    timeDifferenceSeconds: {
      type: Number,
      required: true,
      min: 0,
    },

    matchScore: {
      type: Number,
      required: true,
      min: 0,
      max: 1,
    },

    status: {
      type: String,
      enum: ["potential", "confirmed", "rejected"],
      default: "potential",
    },

    correlatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent the same AI detection from being
// correlated with the same AIS observation more than once.
aiAisCorrelationSchema.index(
  { aiDetection: 1, aisObservation: 1 },
  { unique: true }
);

const AiAisCorrelation = mongoose.model(
  "AiAisCorrelation",
  aiAisCorrelationSchema
);

export default AiAisCorrelation;