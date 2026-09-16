import mongoose from "mongoose";

const aisObservationSchema = new mongoose.Schema(
  {
    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vessel",
    },

    mmsiNumber: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      latitude: {
        type: Number,
        required: true,
      },

      longitude: {
        type: Number,
        required: true,
      },
    },

    speed: {
      type: Number,
      min: 0,
      required: true,
    },

    heading: {
      type: Number,
      min: 0,
      max: 360,
      required: true,
    },

    navigationStatus: {
      type: String,
      trim: true,
    },

    observedAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AisObservation = mongoose.model(
  "AisObservation",
  aisObservationSchema
);

export default AisObservation;