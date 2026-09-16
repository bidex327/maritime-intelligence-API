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
  match: [/^\d{9}$/, "MMSI must contain exactly 9 digits"],
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
  validate: {
    validator: (value) => value <= new Date(),
    message: "Observation time cannot be in the future",
  },
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