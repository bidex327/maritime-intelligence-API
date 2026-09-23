import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    severity: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
    },

    status: {
      type: String,
      enum: ["open", "under_review", "confirmed", "dismissed"],
      default: "open",
    },

    rule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rule",
      required: true,
    },

    aiDetection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AiDetection",
    },

    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vessel",
    },

    aisObservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AisObservation",
    },

    evidence: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
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
  {
    timestamps: true,
  }
);

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;