import Alert from "../models/alertModel.js";

const createAlert = async (alertData) => {
  const alert = await Alert.create(alertData);

  return alert;
};

const getAllAlerts = async () => {
  const alerts = await Alert.find()
    .populate("incident")
    .populate("vessel")
    .sort({ createdAt: -1 });

  return alerts;
};

const getAlertById = async (id) => {
  const alert = await Alert.findById(id)
    .populate("incident")
    .populate("vessel");

  return alert;
};

const updateAlertStatus = async (id, status) => {
  const alert = await Alert.findByIdAndUpdate(
    id,
    { status },
    {
      new: true,
      runValidators: true,
    }
  );

  return alert;
};

export {
  createAlert,
  getAllAlerts,
  getAlertById,
  updateAlertStatus,
};