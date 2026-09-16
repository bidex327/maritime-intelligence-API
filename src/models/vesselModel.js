import mongoose from "mongoose";

const vesselSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    imoNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    mmsiNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    vesselType: {
      type: String,
      required: true,
      trim: true,
    },

    flag: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive", "unknown"],
      default: "unknown",
    },

    position: {
      latitude: {
        type: Number,
      },

      longitude: {
        type: Number,
      },
    },

    speed: {
      type: Number,
      min: 0,
    },

    heading: {
      type: Number,
      min: 0,
      max: 360,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Vessel = mongoose.model("Vessel", vesselSchema);

export default Vessel;